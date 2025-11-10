"""
질문 재작성기 (Rewriter)
-----------------------
검색 결과가 부족하거나 관련성이 낮을 때,
검색 엔진에 최적화된 형태로 질문을 다시 작성한다.
"""

import time
from rag.llm_cache import get_solar_mini
from langchain.schema import SystemMessage, HumanMessage
from utils.logger import setup_logger
from colorama import Fore

logger = setup_logger()


def rewrite_question(question: str) -> str:
    """
    LLM을 이용해 질문을 검색 엔진 친화적으로 재작성한다.

    Args:
        question (str): 원본 질문

    Returns:
        str: 재작성된 질문 (검색 엔진용)
    """

    logger.info(
        Fore.CYAN + "🪄 [Rewrite Node] 문서 부족 → 웹 검색 대비 질문 재작성 중..."
    )

    start = time.time()
    llm = get_solar_mini()
    system_prompt = (
        "너는 개발 관련 질문을 검색 엔진에 적합한 형태로 다시 작성하는 보조 AI야. "
        "질문을 짧고 명확하게, 기술 키워드를 포함해 재작성해줘. "
        "예: '함수명 규칙?' → 'Java 함수명 네이밍 규칙'"
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"원본 질문: {question}"),
    ]

    try:
        logger.info(Fore.CYAN + "🪄 질문 재작성 요청 중...")
        response = llm.invoke(messages)
        rewritten = response.content.strip()
        elapsed = time.time() - start
        logger.info(Fore.GREEN + f"✅ 질문 재작성 완료 → {rewritten} ⏱ {elapsed:.2f}s")
        return rewritten
    except Exception as e:
        logger.error(Fore.RED + f"❌ 질문 재작성 실패: {e}")
        return question
