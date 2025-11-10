"""
utils/rule_parser.py
-----------------------
사용자 코드 컨벤션 문서에서 규칙 항목을 자동 추출한다.
LLM 기반 추론 + fallback regex 병행 방식으로 동작.
"""

from typing import List
from langchain_upstage import ChatUpstage
from utils.config import UPSTAGE_API_KEY
import json, re


def extract_defined_rules_llm(text: str) -> List[str]:
    """
    🚀 자연어 기반 규칙 추출기 (비하드코딩 버전)
    문서 내용을 직접 이해하여 명시적/암시적 규칙 키워드를 추론합니다.
    예:
      "연산자 앞뒤에는 공백을 둔다" → "공백"
      "클래스 이름은 대문자로 시작한다" → "클래스명"
      "함수는 한 줄 이상의 빈 줄을 둔다" → "공백"
    """
    if not text or len(text.strip()) < 5:
        return []

    llm = ChatUpstage(model="solar-1-mini-chat", api_key=UPSTAGE_API_KEY)

    prompt = f"""
다음은 코드 컨벤션 문서의 일부입니다.

---
{text}
---

이 문서에서 명시적 또는 암시적으로 정의된 **규칙 항목**을 두 가지 범주로 분류하세요.

단, 아래 원칙을 반드시 지키세요 👇

---

### 🔹 분류 기준 (엄격)
- **명명 규칙 (Naming Rules)** 은 ‘이름(name)’, ‘표기’, ‘작성 방식’, ‘대소문자 규칙’과 같이 
  **식별자(identifier)의 이름을 다루는 문장**만 포함합니다.
  - 예: “클래스명은 PascalCase로 작성한다”
  - 예: “상수명은 대문자로 작성한다”
  - ✅ 포함되는 키워드: 클래스명, 메서드명, 함수명, 변수명, 상수명, 매개변수명
  - 🚫 “클래스 선언 전후에는 빈 줄을 둔다” → **명명 아님 (layout으로 분류)**

- **구조 규칙 (Layout / Style Rules)** 은 공백, 들여쓰기, 줄바꿈, 빈 줄, 연산자 간격, 주석 스타일 등
  **코드의 배치/형식 관련 문장**입니다.
  - 예: “함수 사이에는 한 줄의 공백을 둔다”
  - 예: “연산자 앞뒤에는 공백을 둔다”
  - ✅ 포함되는 키워드: 공백, 들여쓰기, 빈 줄, 연산자, 주석, 괄호 간격 등

---

출력은 JSON으로만 작성하세요:
{{
  "naming_rules": ["클래스명", "메서드명", "상수명"],
  "layout_rules": ["공백", "들여쓰기", "연산자 간격"]
}}

- “클래스 선언 전후에 공백을 둔다” → 반드시 layout_rules
- “클래스명은 PascalCase로 작성한다” → naming_rules
"""

    try:
        response = llm.invoke(prompt)
        content = response.content.strip()
        rules = json.loads(content)

        # ✅ naming_rules + layout_rules 모두 합치기
        combined = []
        if isinstance(rules, dict):
            combined.extend(rules.get("naming_rules", []))
            combined.extend(rules.get("layout_rules", []))
        elif isinstance(rules, list):
            combined = rules
        else:
            combined = re.findall(r"[가-힣A-Za-z]+명", content)

        return sorted(set(combined))

    except Exception as e:
        # fallback (모델 실패 시 단순 regex 기반 추출)
        candidates = re.findall(
            r"(클래스명|메서드명|함수명|변수명|상수명|매개변수|공백|들여쓰기|연산자|주석)",
            text,
        )
        return sorted(set(candidates))


def extract_defined_rules(text: str) -> List[str]:
    """
    ✅ backward-compatible wrapper
    기존 generator.py 등에서 사용하는 extract_defined_rules() 함수.
    내부적으로 LLM 기반 함수(extract_defined_rules_llm)를 호출한다.
    """
    try:
        rules = extract_defined_rules_llm(text)
        if rules:
            return rules
    except Exception as e:
        print(f"⚠️ LLM 규칙 추출 실패, fallback 사용: {e}")

    # fallback: 간단한 regex 기반
    candidates = re.findall(
        r"(클래스명|메서드명|함수명|변수명|상수명|매개변수|공백|들여쓰기|연산자|주석)",
        text,
    )
    return sorted(set(candidates))
