"""
폴백 응답기 (Fallback)
-----------------------
문서 검색 실패, 비개발 질문, 모델 오류 등의 상황에서
사용자에게 적절한 대체 응답을 생성한다.
"""

from utils.logger import setup_logger
from colorama import Fore

logger = setup_logger()


def generate_fallback_answer(question: str, route: str) -> dict:
    """
    상황에 따라 폴백 응답 메시지를 생성한다.

    Args:
        question (str): 사용자의 질문
        route (str): 분기 상태 ("out_of_scope" | "fallback" 등)

    Returns:
        dict: {"answer": str, "token_usage": dict}
    """

    if route == "out_of_scope":
        logger.warning(Fore.MAGENTA + f"💬 [Fallback] 비개발 질문 감지: {question}")
        answer_text = (
            "해당 질문은 코드 리뷰나 컨벤션과 직접적인 관련이 없습니다. "
            "개발 관련 질문을 입력해주세요. 💡"
        )
    else:
        logger.warning(Fore.YELLOW + f"⚠️ [Fallback] 관련 문서 없음. 질문: {question}")
        answer_text = (
            "관련 문서를 찾을 수 없습니다. "
            "코드 컨벤션 DB를 확인하거나 관리자에게 문의해주세요."
        )

    return {"answer": answer_text, "token_usage": {}}
