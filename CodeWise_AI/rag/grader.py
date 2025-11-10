"""
문서 평가기 (Grader)
-----------------------
검색된 문서 및 생성된 답변의 품질을 평가한다.
기본은 룰 기반으로 동작하며, 향후 LLM 기반 평가로 확장 가능.
"""

from utils.logger import setup_logger
from colorama import Fore
from rag.llm_cache import get_solar_mini
import json
import time
import requests

logger = setup_logger()


def grade_documents(docs: list) -> str:
    """
    검색된 문서의 품질을 평가하여 결과를 반환한다.

    Args:
        docs (list): 검색된 문서 리스트

    Returns:
        str: 'good' | 'rewrite'
    """
    start_time = time.time()
    logger.info(Fore.CYAN + "🔹 [GradeDocuments] 검색된 문서의 관련성 평가 중...")

    if not docs:
        logger.warning(Fore.YELLOW + "⚠️ 문서 없음 → rewrite")
        return "rewrite"

    if len(docs) >= 2:
        verdict = "good"
        logger.info(Fore.GREEN + "✅ 문서 충분 → good")
    else:
        verdict = "rewrite"
        logger.warning(Fore.YELLOW + "⚠️ 문서 부족 → rewrite")

    elapsed = round(time.time() - start_time, 2)
    logger.info(Fore.CYAN + f"⏱ 문서 평가 완료 — 소요 시간: {elapsed}s")
    return verdict


# 🔹 답변 품질 평가
def grade_answer(question: str, answer: str) -> dict:
    """
    LLM을 이용해 생성된 답변의 품질을 평가한다.

    Args:
        question (str): 사용자의 질문
        answer (str): LLM이 생성한 답변

    Returns:
        dict: {
          "relevance": float,
          "accuracy": float,
          "clarity": float,
          "readability": float,
          "score": float,
          "verdict": str
        }
    """
    start_time = time.time()
    logger.info(Fore.CYAN + "🔹 [GradeAnswer] 생성된 답변 품질 평가 중...")

    if not answer.strip():
        logger.warning(Fore.YELLOW + "⚠️ 빈 답변 감지 → poor")
        return {"score": 0.0, "verdict": "poor"}

    llm = get_solar_mini()
    system_prompt = (
        "너는 코드 리뷰 및 문서 품질 평가자야. "
        "주어진 질문과 답변을 보고, 답변의 품질을 평가해. "
        "각 기준의 중요도를 아래와 같이 고려해 점수를 계산해.\n\n"
        "각 기준의 중요도를 아래와 같이 고려해 점수를 계산해.\n\n"
        "평가 기준 및 가중치:\n"
        "1. 질문에 대한 관련성 (30%)\n"
        "2. 기술적 정확성 (30%)\n"
        "3. 설명의 구체성과 근거 유무 (25%)\n"
        "4. 가독성과 구조적 완성도 (15%)\n\n"
        "각 항목별로 0~1 사이의 점수를 주고, 가중 평균을 계산해 최종 점수를 결정해.\n"
        "결과는 반드시 JSON 형태로 출력해.\n"
        '예: {"relevance": 0.9, "accuracy": 0.8, "clarity": 0.7, "readability": 0.9, "score": 0.83, "verdict": "excellent"}'
    )

    prompt = f"질문: {question}\n\n답변: {answer}"

    try:
        response = llm.invoke(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ]
        )

        text = response.content.strip()

        try:
            result = json.loads(text)
        except json.JSONDecodeError:
            logger.warning(Fore.YELLOW + "⚠️ JSON 파싱 실패 → 기본 점수 부여")
            result = {
                "relevance": 0.5,
                "accuracy": 0.5,
                "clarity": 0.5,
                "readability": 0.5,
                "score": 0.5,
                "verdict": "adequate",
            }

        elapsed = round(time.time() - start_time, 2)
        result["elapsed_time"] = elapsed

        logger.info(
            Fore.GREEN
            + f"✅ 답변 평가 완료 → 점수: {result['score']}, 등급: {result['verdict']} (⏱ {elapsed}s)"
        )
        return result

    except Exception as e:
        logger.error(Fore.RED + f"❌ 답변 품질 평가 실패: {e}")
        return {
            "relevance": 0,
            "accuracy": 0,
            "clarity": 0,
            "readability": 0,
            "score": 0.0,
            "verdict": "poor",
        }


# 백그라운드에서 답변 평가
def run_async_grader(question: str, answer: str):
    """
    백그라운드에서 답변 품질 평가 수행
    """
    logger.info(Fore.CYAN + "🏁 [AsyncGrader] 백그라운드 평가 시작...")
    start = time.time()

    try:
        result = grade_answer(question, answer)
        elapsed = round(time.time() - start, 2)

        logger.info(
            Fore.GREEN
            + f"✅ [AsyncGrader] 평가 완료 → 점수 {result['score']}, 등급 {result['verdict']} ⏱ {elapsed}s"
        )

    except Exception as e:
        logger.error(Fore.RED + f"❌ [AsyncGrader] 품질 평가 실패: {e}")
