"""
RAG 파이프라인 실행
----------------------------------
LangGraph를 이용해 문서 검색 → 답변 생성 → 종료까지의 전체 흐름을 자동 제어한다.
"""

from graph.graph_builder import build_graph
from utils.logger import setup_logger
from rag.reviewer import review_code  # 코드 리뷰 모듈 추가 import

logger = setup_logger()

# LangGraph 그래프 빌드 (일반 QA용)
rag_graph = build_graph()


def run_rag_pipeline(
    question: str,
    repo_id: int | None = None,
    language: str | None = None,
    code_snippet: str | None = None,
) -> str:
    """
    LangGraph 기반 RAG 파이프라인 실행 함수.

    Args:
        question (str): 사용자의 질문
        repo_id (int | None): 질문이 속한 레포 ID (벡터 컬렉션 구분용)
        language (str | None): 언어 정보 (예: "Java", "Python")
        code_snippet (str | None): 코드 리뷰용 스니펫

    Returns:
        dict: {
            "question": str,
            "answer": str,
            "usage": dict  # (input/output/total 토큰 정보)
        }
    """

    logger.info(
        f"🤖 pipeline.py: {question} | repo_id={repo_id}, language={language}, has_code={bool(code_snippet)}"
    )

    # 코드 리뷰 모드 분기
    if code_snippet:
        logger.info("🧩 코드리뷰 모드 실행 시작")
        review_result = review_code(
            question=question,
            code_snippet=code_snippet,
            repo_id=repo_id,
            language=language,
        )

        return {
            "question": question,
            "answer": review_result["answer"],  # 요약 + 코드 피드백
            "usage": review_result.get("usage", {}),
            "mode": "code_review",
        }

    # 초기 상태(state) 정의
    inputs = {
        "question": question,  # GraphState의 query 필드
        "repo_id": repo_id,
        "language": language,
        "context_docs": [],  # 검색 결과 (초기에는 빈 리스트)
        "answer": "",  # LLM 응답 (초기에는 없음)
    }
    # 그래프 실행
    result = rag_graph.invoke(inputs)
    answer_data = result.get("answer", {})

    # 답변 + 토큰 사용량 정리
    answer_text = answer_data.get("answer", "")
    usage = answer_data.get("token_usage", {})

    # 최종 결과 반환
    return {
        "question": question,
        "answer": answer_text,
        "usage": usage,
    }
