"""
질문 의도 분류기 (Intent Classifier)
----------------------------------
사용자의 질문이 개발 관련인지 판별하고,
필요 시 향후 LLM 기반 분류로 확장 가능.
"""

from utils.logger import setup_logger
from colorama import Fore

logger = setup_logger()

# 비개발 질문 키워드 (임시 룰 기반)
OUT_OF_SCOPE_KEYWORDS = [
    "날씨",
    "기분",
    "음식",
    "오늘",
    "영화",
    "음악",
    "연예인",
    "스포츠",
    "게임",
    "뉴스",
]


def classify_intent(question: str) -> str:
    """
    질문의 의도를 판별한다.

    Args:
        question (str): 사용자의 질문

    Returns:
        str: "in_scope" | "out_of_scope"
    """

    q = question.strip().lower()
    logger.info(Fore.CYAN + "🔹 [Intent] 사용자의 질문 의도 판별 중...")

    # 비개발 관련 키워드 감지
    if any(keyword in q for keyword in OUT_OF_SCOPE_KEYWORDS):
        logger.warning(Fore.YELLOW + "🚫 개발 관련 질문이 아님 → OutOfScope")
        return "out_of_scope"

    # 향후 확장 포인트
    # - LLM 기반 intent 분류
    # - 코드 스니펫 감지 (``` 포함 여부)
    # - 도메인별 intent 클러스터링

    logger.info(Fore.GREEN + "✅ 개발 관련 질문 감지 → InScope")
    return "in_scope"
