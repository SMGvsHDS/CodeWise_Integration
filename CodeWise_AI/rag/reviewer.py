"""
코드 리뷰어 (Reviewer)
-----------------------
1️⃣ 레포 컨벤션 + 공식 문서에서 규칙 텍스트를 검색하고
2️⃣ 코드 스니펫을 그 규칙들과 비교하여
3️⃣ 위반/일치/개선점을 LLM을 통해 자연어로 정리한다.
"""

from rag.retriever import retrieve_similar_docs
from rag.generator import generate_answer
from utils.logger import setup_logger

logger = setup_logger()


def review_code(question: str, code_snippet: str, repo_id: int, language: str):
    """RAG 기반 코드 리뷰 수행"""
    logger.info(f"🧩 코드 리뷰 시작 (repo_id={repo_id}, lang={language})")

    # 1️⃣ 컨벤션 및 공식 문서 검색
    context_docs = retrieve_similar_docs(
        query=question,
        repo_id=repo_id,
        language=language,
        top_k=5,
        code_snippet=code_snippet,  # 코드 내용까지 함께 검색 질의 강화
    )

    # 3️⃣ LLM에게 코드 리뷰 생성 요청
    result = generate_answer(
        question=question,  # prompt를 question 자리에 전달
        context_docs=context_docs,  # context_docs는 generator에서 요구됨
        code_snippet=code_snippet,  # generator 내부 코드리뷰 분기 유지
        language=language,
    )

    return {
        "answer": result["answer"],
        "references": [d["source"] for d in context_docs],  # 문서 출처 요약
        "usage": result.get("usage", {}),
    }
