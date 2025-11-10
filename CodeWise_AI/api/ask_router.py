"""
/ai/ask 엔드포인트 — 질문 수신 및 파이프라인 실행
"""

import time
from fastapi import APIRouter, BackgroundTasks
from rag.pipeline import run_rag_pipeline
from rag.grader import run_async_grader
from utils.logger import setup_logger
from pydantic import BaseModel
from fastapi.responses import JSONResponse

router = APIRouter()
logger = setup_logger()


class QuestionRequest(BaseModel):
    question: str
    repo_id: int | None = None
    language: str | None = None
    code_snippet: str | None = None


@router.post("/ask")
async def ask_ai(payload: QuestionRequest, background_tasks: BackgroundTasks):
    """
    사용자의 질문을 받아 관련 문서를 검색하고,
    Upstage Solar 모델을 통해 답변을 생성한다.
    """

    question = payload.question.strip()
    repo_id = payload.repo_id
    language = payload.language or "Java"
    code_snippet = payload.code_snippet.strip()

    if not question:
        return {"error": "❌ 질문이 비어 있습니다."}

    logger.info(
        f"🤖 질문 수신: {question} (repo_id={repo_id}, language={language}, code_snippet={code_snippet})"
    )

    start_time = time.time()

    try:
        result = run_rag_pipeline(
            question=question,
            repo_id=repo_id,
            language=language,
            code_snippet=code_snippet,
        )
        answer = result.get("answer", "")
        usage = result.get("usage", {})

        total_elapsed = round(time.time() - start_time, 2)
        logger.info(f"⏱ [Total] AI 전체 처리 시간: {total_elapsed}s")

        # 품질 평가를 백그라운드에서 수행
        background_tasks.add_task(run_async_grader, question, answer)

        logger.info("✅ 응답 즉시 반환 (품질 평가는 백그라운드 처리)")
        response = {
            "success": True,
            "question": question,
            "answer": answer,
            "usage": usage,
        }
        return JSONResponse(content=response)

    except Exception as e:
        logger.error(f"❌ 오류: {e}")
        error_response = {
            "success": False,
            "question": question,
            "answer": "",
            "usage": {},
            "error": str(e),
        }
        return JSONResponse(content=error_response)
