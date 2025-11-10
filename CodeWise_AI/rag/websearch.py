"""
웹 검색기 (Web Search)
-----------------------
DuckDuckGo 기반의 웹 검색을 수행하여
RAG 파이프라인에서 사용할 문서 컨텍스트를 생성한다.
"""

from langchain_community.tools import DuckDuckGoSearchRun
from utils.logger import setup_logger
from colorama import Fore

logger = setup_logger()


def perform_web_search(question: str) -> list[dict]:
    """
    DuckDuckGo를 이용해 질문에 대한 검색을 수행한다.

    Args:
        question (str): 재작성된 질문 (검색 엔진용)

    Returns:
        list[dict]: [{ "content": str, "score": float, "source": str }]
    """
    logger.info(Fore.CYAN + f"🔹 [WebSearch] DuckDuckGo 검색 시작 → {question}")

    try:
        tool = DuckDuckGoSearchRun()
        results = tool.invoke(question)

        if not results:
            logger.warning(Fore.YELLOW + "⚠️ DuckDuckGo 검색 결과 없음.")
            return []

        logger.info(Fore.GREEN + f"🌐 DuckDuckGo 검색 완료 ({len(results)} chars)")
        return [
            {
                "content": results,
                "score": 1.0,  # 웹 검색은 임의의 점수
                "source": "web_search",
            }
        ]
    except Exception as e:
        logger.error(Fore.RED + f"❌ DuckDuckGo 검색 실패: {e}")
        return [
            {
                "content": "DuckDuckGo 검색 실패",
                "score": 0,
                "source": "web_search",
            }
        ]
