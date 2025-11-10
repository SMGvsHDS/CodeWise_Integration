"""
환경 변수 및 전역 설정 관리
--------------------------
.env 파일을 로드하고, 주요 환경 변수를 전역적으로 접근 가능하게 한다.
"""

from dotenv import load_dotenv
import os

# .env 로드
load_dotenv()

# 환경 변수 가져오기
UPSTAGE_API_KEY = os.getenv("UPSTAGE_API_KEY")
CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_db")
# BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080")
LANGCHAIN_TRACING_V2 = (os.getenv("LANGCHAIN_TRACING_V2") or "false").lower() == "true"
LANGCHAIN_ENDPOINT = os.getenv("LANGCHAIN_ENDPOINT")
LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_KEY")
LANGCHAIN_PROJECT = os.getenv("LANGCHAIN_PROJECT")


# 유효성 체크
def validate_env():
    if not UPSTAGE_API_KEY:
        raise ValueError("❌ UPSTAGE_API_KEY is not set in .env file.")
    if LANGCHAIN_TRACING_V2 and not LANGCHAIN_API_KEY:
        raise ValueError("❌ LANGCHAIN_API_KEY is not set while tracing is enabled.")
    print("✅ 환경 변수 로드 완료")
    print(f"📦 Chroma Path: {CHROMA_PATH}")
    print(f"🧠 LangSmith Enabled: {LANGCHAIN_TRACING_V2}")
    if LANGCHAIN_TRACING_V2:
        print(f"📡 LangSmith Project: {LANGCHAIN_PROJECT}")
