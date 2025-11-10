"""
CodeWise_AI 서버 진입점
-----------------------
FastAPI 기반의 AI 서버 실행 파일.
AI 관련 요청(/ai/ask)을 받아 LangGraph RAG 파이프라인을 실행하고,
결과를 백엔드(Spring Boot)로 전달한다.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.logger import setup_logger
from utils.config import UPSTAGE_API_KEY, validate_env
from api.ask_router import router as ask_router
from api.convention_router import router as convention_router

# 로거 초기화
logger = setup_logger()

# 환경 변수 유효성 검증
try:
    validate_env()
    logger.info(f"UPSTAGE_API_KEY loaded: {bool(UPSTAGE_API_KEY)}")
except ValueError as e:
    logger.error(str(e))
    raise

# FastAPI 앱 생성
app = FastAPI(
    title="CodeWise AI Server",
    description="AI-powered Code Convention & Code Review Assistant",
    version="1.0.0",
)

# CORS 설정 (백엔드 호출 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(ask_router, prefix="/ai", tags=["AI"])
app.include_router(convention_router, prefix="/ai", tags=["AI"])


# 기본 라우트
@app.get("/")
def root():
    logger.info("Health check requested")
    return {"message": "🚀 CodeWise AI Server is running!"}


# 로컬 실행용
if __name__ == "__main__":
    import uvicorn

    logger.info("🚀 Starting CodeWise AI Server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
