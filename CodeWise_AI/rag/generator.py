"""
답변 생성기 (Generator)
-----------------------
검색된 문서(컨텍스트)와 질문을 기반으로
Upstage Solar LLM을 호출하여 답변을 생성한다.
"""

from langchain.schema import SystemMessage, HumanMessage
from utils.logger import setup_logger
from rag.llm_cache import get_solar_mini
from utils.reference_mapper import linkify_reference
from utils.rule_parser import extract_defined_rules
import time
import re
import json
import ast
import subprocess
import tempfile
import os

logger = setup_logger()


# ✅ 언어별 문법 검증 함수 (soft check: 실패해도 전체 프로세스는 멈추지 않음)
def validate_code(language: str, code: str) -> bool:
    """언어별 문법 검증 (모든 언어 지원, 미지원 언어는 soft-pass)"""
    if not code or not code.strip():
        return True

    lang = (language or "").lower()

    try:
        # 🐍 Python
        if lang == "python":
            ast.parse(code)
            return True

        # ☕ Java
        elif lang == "java":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".java") as tmp:
                tmp.write(code.encode("utf-8"))
                tmp.flush()
                result = subprocess.run(
                    ["javac", tmp.name],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                )
            os.remove(tmp.name)
            if result.returncode != 0:
                logger.warning(f"⚠️ Java 문법 오류:\n{result.stderr}")
                return False
            return True

        # 💻 JavaScript
        elif lang in ("javascript", "js"):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".js") as tmp:
                tmp.write(code.encode("utf-8"))
                tmp.flush()
                result = subprocess.run(
                    ["node", "--check", tmp.name],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                )
            os.remove(tmp.name)
            if result.returncode != 0:
                logger.warning(f"⚠️ JavaScript 문법 오류:\n{result.stderr}")
                return False
            return True

        # 🌍 그 외 언어 — soft-pass
        else:
            logger.info(f"🌐 [{language}] 문법 검증 미지원 → 통과 (soft check)")
            return True

    except Exception as e:
        logger.warning(f"⚠️ [{language}] 문법 검증 중 예외 발생: {e}")
        return True


# ✅ 안전한 답변 생성 (문법 검증 + 자동 재시도 포함)
def safe_generate_answer(llm, system_prompt, human_prompt, language: str):
    """LLM 호출 후 문법 검증 + 자동 재시도 수행"""
    response = llm.invoke(
        [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": human_prompt},
        ]
    )
    text = response.content.strip()

    try:
        parsed_json = json.loads(text)
        final_code = parsed_json.get("final_code", "").strip()

        # 코드 블록 제거
        if final_code.startswith("```"):
            final_code = re.sub(r"^```[a-zA-Z]*", "", final_code)
            final_code = re.sub(r"```$", "", final_code).strip()

        # ✅ 문법 검증
        if not validate_code(language, final_code):
            logger.warning("⚠️ 문법 오류 → 재시도 수행 중...")
            retry_prompt = (
                f"이전 코드에 {language} 문법 오류가 있습니다. "
                f"문법적으로 올바르게 다시 수정하세요.\n\n"
                f"잘못된 코드:\n```{language}\n{final_code}\n```"
            )
            retry_response = llm.invoke(
                [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": retry_prompt},
                ]
            )
            # ✅ 재시도 결과를 그대로 반환
            return retry_response or response

    except Exception as e:
        logger.warning(f"⚠️ 문법검증 스킵: {e}")

    return response


def generate_answer(
    question: str,
    context_docs: list[dict],
    code_snippet: str | None = None,
    language: str | None = None,
) -> dict:
    """
    Upstage Solar LLM을 이용해 답변을 생성한다.
    """
    try:
        start_time = time.time()
        llm = get_solar_mini()

        # 1️⃣ 소스별 문서 분류
        convention_docs = [
            doc for doc in context_docs if "repo" in doc.get("source", "")
        ]
        official_docs = [
            doc for doc in context_docs if "style" in doc.get("source", "")
        ]

        # 2️⃣ 문서 내용 정렬 및 병합
        def format_docs(docs):
            sorted_docs = sorted(docs, key=lambda x: x.get("score", 0))
            return "\n\n".join([d["content"] for d in sorted_docs])

        convention_text = format_docs(convention_docs)
        official_text = format_docs(official_docs)

        # ✅ 3️⃣ 사용자 문서 기반 규칙 자동 추출 + 컨텍스트 병합
        user_defined_rules = extract_defined_rules(convention_text)
        logger.info(f"🧭 사용자 문서 정의 규칙 자동 추출: {user_defined_rules}")

        if not user_defined_rules:
            logger.info("📘 사용자 문서에서 규칙을 찾지 못함 → 공식 문서만 사용")
            merged_text = official_text or "(공식 문서 없음)"
        else:
            merged_text = (
                f"📗 [사용자 코드 컨벤션 문서]\n{convention_text}\n\n"
                f"📘 [공식 문서 (fallback)]\n{official_text or '(없음)'}"
            )

        # ✅ 사용자 문서에 정의되지 않은 규칙명 추정
        # (공식 문서에서 커버해야 할 영역)
        fallback_notice = ""
        if user_defined_rules:
            fallback_notice = (
                f"\n\n💡 사용자 문서에는 다음 규칙만 정의되어 있습니다: {', '.join(user_defined_rules)}."
                " 따라서 이외의 항목(예: 메서드, 변수, 상수 등)은 공식 문서(PEP8)를 기준으로 판단해야 합니다."
            )

        # 4️⃣ 프롬프트 생성
        if code_snippet:
            logger.info("🧩 코드리뷰 프롬프트 생성 중...")
            prompt = f"""
당신은 전문 코드 리뷰어이자 코드 컨벤션 전문가입니다.  
반드시 **한국어로 작성**해야 합니다.  
다음 3단계를 순서대로 수행하세요.

---

### 1️⃣ 규칙 판별 단계
- 사용자 코드 컨벤션 문서와 공식 문서를 모두 읽으세요.  
- 각 항목별로 **사용자 문서에 정의된 규칙만** 우선 적용하세요.  
- 사용자 문서에 정의된 규칙만 **사용자 코드 컨벤션 문서** 근거로 표시하세요.  
- 사용자 문서에 정의되지 않은 항목은 **공식 문서(PEP8 등)** 을 참고할 수 있습니다.  

⚠️ 단, 공식 문서를 참고할 때 다음을 반드시 지키세요:
- 사용자 문서에 명시되지 않은 규칙은 공식 문서(PEP8 등)를 참고하여 **문법적 타당성만 검증**하세요.  
- 해당 규칙이 사용자 문서에 전혀 언급되지 않았다면,  
  그 규칙에 대한 “위반 항목”을 새로 만들거나 “근거”를 공식 문서로 추가하지 마세요.  
- 즉,  
  - 공식 문서는 **문법 오류 방지용 보조 자료**일 뿐입니다.  
  - 사용자 문서에 존재하지 않는 규칙을 “공식 문서 근거로 유추”하는 것은 금지입니다.  

{fallback_notice}

---

📋 사용자 정의 규칙 (JSON)
이 목록에 포함된 항목만 “사용자 코드 컨벤션 문서” 근거로 사용할 수 있습니다.  
JSON 데이터 외의 항목은 모두 무시하거나, 문법 오류일 경우에만 검증하세요.

{json.dumps(user_defined_rules, ensure_ascii=False)}

---

### 2️⃣ 위반 탐지 단계
- 코드에서 실제로 **위반된 항목만** 탐지하세요.  
- 일반적인 가능성, 추측, 요약 등은 작성하지 마세요.  
- 각 위반 항목은 다음 3가지를 포함해야 합니다:  
  - title: 항목명  
  - description: 위반된 이유 (짧고 구체적으로)  
  - reference: '사용자 코드 컨벤션 문서' 또는 '공식 문서(PEP8 등)'  

- 각 description은 다음 형식을 따르세요:  
  - "{{항목명}}은(는) {{올바른 규칙}}으로 작성해야 하지만, '{{문제코드명}}'은(는) {{잘못된 형태}}로 작성되었습니다."  
  - 예: "연산자 앞뒤에는 한 칸의 공백을 둬야 하지만, 'total=10+5'는 공백이 없습니다."

---

### 3️⃣ 코드 수정 단계
- 모든 위반 항목을 수정한 **최종 코드(final_code)** 를 작성하세요.  
- 명명 규칙은 사용자 문서가 우선이며, 구조 규칙은 문법적으로 자연스럽게 수정하세요.  
- “클래스 선언 전후 공백” 규칙이 있다면, 실제로 `class` 선언 위와 아래에 빈 줄을 추가하세요.  
- print문, 반환값 등 **로직은 절대 변경하지 말고**,  
  이름, 들여쓰기, 공백, 선언 위치 등 **스타일만 수정**하세요.  
- 수정 코드는 문법적으로 완전해야 하며 실제 실행 시 오류가 없어야 합니다.  
- 공백 및 줄바꿈 규칙은 실제 코드에 반영되어야 합니다.
  - “클래스 선언 전후에는 반드시 빈 줄을 추가한다” 규칙이 있다면, `class` 위와 아래에 실제 **빈 줄 두 줄(\\n\\n)** 을 삽입하세요.  
  - “함수 사이에 한 줄의 공백을 둔다” 규칙이 있다면, 함수 선언 간에 실제 **빈 줄 한 줄(\\n)** 을 추가하세요.  
  - 코드 출력 시 `\\n` 또는 `\\n\\n`은 실제 빈 줄로 해석되어야 합니다.

---

📦 출력 형식(JSON):
{{
    "violations": [
        {{
            "title": "위반 항목 제목",
            "description": "위반 이유 설명",
            "reference": "근거 문서명 또는 링크"
        }}
    ],
    "final_code": "규칙에 맞게 수정된 코드"
}}

📘 참고 문서:
{merged_text or "(관련 문서 없음)"}

=== 코드 스니펫 ===
```{language or ''}\n{code_snippet}\n```

=== 질문 ===
{question}

💬 위 정보를 종합해 JSON 형식으로 코드 리뷰 결과를 작성하세요.
"""

        else:
            logger.info("💬 일반 Q&A 프롬프트 생성 중...")
            context_text = merged_text or "(관련 문서 없음)"
            prompt = (
                "당신은 코드 리뷰 및 컨벤션 전문가입니다.\n"
                "아래의 문서를 참고하여 질문에 대한 구체적이고 실용적인 답변을 작성하세요.\n"
                "답변은 자연스럽고 완성된 문장으로 작성하며, 문서의 출처나 제목을 직접 언급하지 마세요.\n"
                "📗 [사용자 코드 컨벤션 문서]가 존재할 경우, 반드시 그 내용을 최우선으로 반영하고, "
                "📘 [공식 문서]의 내용은 그 보조 자료로만 참고하세요.\n"
                "답변에는 사용자 문서의 내용을 명시적으로 언급하지 말고, "
                "그 지침을 자연스럽게 녹여서 하나의 통합된 규칙처럼 설명하세요.\n"
                "전체 답변은 일관되고 자연스러워야 하며, 전문가의 가이드라인처럼 들려야 합니다.\n\n"
                f"=== 참고 문서 ===\n{context_text}\n\n"
                f"=== 질문 ===\n{question}\n\n"
                "=== 답변 ==="
            )

        # 5️⃣ LLM 호출
        logger.info("🧠 LLM 답변 생성 중...")
        response = safe_generate_answer(
            llm,
            "당신은 코드 리뷰 및 컨벤션 전문가입니다. 반드시 한국어로만 답변해야 합니다.",
            prompt,
            language,
        )

        # 6️⃣ JSON 파싱 및 Markdown 변환
        try:
            parsed = json.loads(response.content.strip())
        except json.JSONDecodeError:
            logger.warning("⚠️ JSON 파싱 실패 → 자동 복구 시도")
            text = response.content.strip()

            # ✅ 코드 블록, 마크다운, 공백 정리
            text = re.sub(r"```[a-zA-Z]*", "", text)
            text = re.sub(r"```", "", text)
            text = text.replace("\n", " ").replace("\\n", "\n")

            # ✅ 중괄호 괄호 균형 깨짐 보정
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1:
                text = text[start : end + 1]

            try:
                parsed = json.loads(text)
            except Exception as e:
                logger.warning(f"⚠️ JSON 복구 실패 ({e}) → 기본 텍스트로 대체")
                parsed = {"violations": [], "final_code": text}

        # ✅ Markdown 변환 (항상 answer를 구성하도록)
        md_parts = []
        for i, v in enumerate(parsed.get("violations", []), 1):
            ref = v.get("reference", "").strip()
            if ref == "사용자 코드 컨벤션 문서":
                ref_text = ref
            else:
                ref_text = linkify_reference(ref, v.get("source", ""))
            md_parts.append(
                f"{i}️⃣ **{v['title']}**\n"
                f"   - **위반 내용:** {v['description']}\n"
                f"   - **근거:** {ref_text}\n"
            )

        final_code = parsed.get("final_code", "").strip()
        if final_code.startswith("```"):
            final_code = re.sub(r"^```[a-zA-Z]*\n?", "", final_code)
            final_code = re.sub(r"\n?```$", "", final_code)
            final_code = final_code.rstrip()

        md_parts.append(
            f"\n✅ **최종 수정된 코드 예시:**\n```{language.lower()}\n{final_code}\n```"
        )

        answer = "\n".join(md_parts).strip()

        usage = response.response_metadata.get("token_usage", {})
        total_elapsed = time.time() - start_time
        logger.info(
            f"✅ 답변 생성 완료. 총 소요시간 ⏱ {total_elapsed:.2f}s, 토큰 사용량: {usage}"
        )

        return {"answer": answer, "token_usage": usage}

    except Exception as e:
        logger.error(f"❌ 답변 생성 실패: {e}")
        raise
