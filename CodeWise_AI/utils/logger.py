"""
로그 설정 모듈
-------------
Loguru를 사용해 터미널/파일 로그를 동시에 출력하고,
로그 레벨별로 색상과 포맷을 다르게 표시한다.
"""

from loguru import logger
import sys
import os
from datetime import datetime


def setup_logger():
    # 로그 디렉토리 생성
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)

    # 로그 파일명 (날짜별)
    log_file = os.path.join(
        log_dir, f"ai_server_{datetime.now().strftime('%Y%m%d')}.log"
    )

    # 기존 핸들러 제거 (중복 방지)
    logger.remove()

    # 콘솔 출력 핸들러
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>",
        level="INFO",
    )

    # 파일 저장 핸들러
    logger.add(
        log_file,
        rotation="10 MB",  # 10MB마다 새 파일 생성
        retention="7 days",  # 7일간 보관
        encoding="utf-8",
        level="INFO",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    )

    logger.info("✅ Logger initialized successfully.")
    return logger
