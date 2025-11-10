"""
텍스트 임베딩 모듈
------------------
Upstage Embedding API를 이용해 문서 텍스트를 벡터로 변환한다.
"""

import time
from langchain_upstage import UpstageEmbeddings
from utils.config import UPSTAGE_API_KEY
from utils.logger import setup_logger

logger = setup_logger()


def get_embedder():
    """
    Upstage 임베딩 모델 인스턴스를 반환한다.
    """
    try:
        start = time.time()
        embedder = UpstageEmbeddings(model="embedding-query", api_key=UPSTAGE_API_KEY)
        elapsed = round(time.time() - start, 2)
        logger.info(f"✅ Upstage 임베딩 모델 초기화 완료 ⏱ {elapsed}s")
        return embedder
    except Exception as e:
        logger.error(f"❌ 임베딩 모델 초기화 실패: {e}")
        raise


def embed_texts(texts: list[str]):
    """
    텍스트 리스트를 벡터 리스트로 변환.
    """
    embedder = get_embedder()
    try:
        start = time.time()
        embeddings = embedder.embed_documents(texts)
        elapsed = round(time.time() - start, 2)

        logger.info(
            f"✅ {len(embeddings)}개 문서 임베딩 완료 ⏱ {elapsed}s "
            f"(평균 {elapsed / max(len(texts), 1):.2f}s/문서)"
        )
        return embeddings
    except Exception as e:
        logger.error(f"❌ 임베딩 변환 중 오류 발생: {e}")
        raise
