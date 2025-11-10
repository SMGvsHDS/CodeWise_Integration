"""
/ai/conventions — 코드 컨벤션 임베딩 저장 및 관리
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from rag.vectorstore import (
    add_single_convention,
    get_conventions_by_repo,
    delete_convention,
    update_convention,
)
from fastapi import HTTPException
from utils.logger import setup_logger

router = APIRouter()
logger = setup_logger()


class ConventionRequest(BaseModel):
    content: str
    title: str | None = None
    repo_id: int | None = None
    language: str | None = None
    convention_id: int | None = None


@router.post("/conventions")
async def add_convention(request: ConventionRequest):
    """
    [POST] 코드 컨벤션 벡터DB에 임베딩&저장
    """
    try:
        repo_id = request.repo_id or 1
        title = request.title or "Untitled Convention"
        language = request.language or "Java"
        content = request.content.strip()
        convention_id = request.convention_id

        if not repo_id or not content or not convention_id:
            return JSONResponse(
                content={
                    "success": False,
                    "message": "repo_id, content, convention_id는 필수입니다.",
                },
                status_code=400,
            )

        logger.info(
            f"🧩 [POST] repo_id={repo_id}, convention_id={convention_id}, title={title}, language={language}"
        )
        add_single_convention(repo_id, title, language, content, convention_id)

        return JSONResponse(
            content={"success": True, "message": "✅ 컨벤션 임베딩 및 벡터 저장 완료"},
            status_code=201,
        )

    except Exception as e:
        logger.error(f"❌ 컨벤션 임베딩 실패: {e}")
        return JSONResponse(
            content={"success": False, "message": str(e)}, status_code=500
        )


@router.get("/conventions")
async def get_conventions(repo_id: int = Query(..., description="레포 ID")):
    """
    [GET] 특정 레포의 컨벤션 목록 조회 (벡터DB 기준)
    """
    try:
        logger.info(f"📘 [GET] repo_id={repo_id}")
        docs = get_conventions_by_repo(repo_id)

        return JSONResponse(
            content={
                "success": True,
                "repo_id": repo_id,
                "count": len(docs),
                "data": docs,
            },
            status_code=200,
        )

    except Exception as e:
        logger.error(f"❌ 컨벤션 조회 실패: {e}")
        return JSONResponse(
            content={"success": False, "message": str(e)}, status_code=500
        )


@router.patch("/conventions/{convention_id}")
async def update_convention_api(convention_id: int, request: ConventionRequest):
    try:
        repo_id = request.repo_id or 1
        title = request.title or "Untitled Convention"
        language = request.language or "Java"
        content = request.content.strip()

        update_convention(repo_id, convention_id, title, language, content)
        return JSONResponse(
            content={"success": True, "message": "🔁 컨벤션 수정 및 재임베딩 완료"},
            status_code=200,
        )
    except Exception as e:
        logger.error(f"❌ 컨벤션 수정 실패: {e}")
        raise HTTPException(status_code=500, detail=f"컨벤션 수정 실패: {e}")


@router.delete("/conventions/{convention_id}")
async def delete_convention_api(
    convention_id: int, repo_id: int = Query(..., description="레포 ID")
):
    try:
        delete_convention(repo_id, convention_id)
        return JSONResponse(
            content={"success": True, "message": "🧹 컨벤션 벡터 삭제 완료"},
            status_code=200,
        )
    except Exception as e:
        logger.error(f"❌ 컨벤션 삭제 실패: {e}")
        raise HTTPException(status_code=500, detail=f"컨벤션 삭제 실패: {e}")
