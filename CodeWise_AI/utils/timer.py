# utils/timer.py
"""
요청/응답 시간 측정용 데코레이터
--------------------------------
함수 실행 전후로 시간을 측정하고, 실행 시간을 로그로 출력.
"""

import time
from functools import wraps
from utils.logger import setup_logger

logger = setup_logger()


def timer(func):
    """함수 실행 시간을 측정하는 데코레이터"""

    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        logger.info(f"⏳ '{func.__name__}' started.")
        result = func(*args, **kwargs)
        end = time.time()
        duration = end - start
        logger.info(f"✅ '{func.__name__}' finished in {duration:.3f} seconds.")
        return result

    return wrapper
