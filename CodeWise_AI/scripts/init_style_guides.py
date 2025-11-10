"""
공식 스타일 가이드 임베딩 스크립트
-----------------------------------
docs/style_guides/ 아래의 언어별 txt 파일을 읽어
각 언어별로 Chroma 컬렉션(style_guides_<lang>)을 생성한다.
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from rag.embedder import get_embedder
from langchain_community.vectorstores import Chroma
from utils.logger import setup_logger

logger = setup_logger()

STYLE_GUIDE_PATH = "./docs/style_guides"
CHROMA_PATH = "./chroma_db"


def embed_style_guides():
    embedding = get_embedder()

    for file in os.listdir(STYLE_GUIDE_PATH):
        if not file.endswith(".txt"):
            continue

        lang = os.path.splitext(file)[0].lower()
        file_path = os.path.join(STYLE_GUIDE_PATH, file)

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                logger.warning(f"⚠️ {file} 내용이 비어 있어 건너뜀.")
                continue

        persist_path = f"{CHROMA_PATH}/style_guides_{lang}"
        collection_name = f"style_guides_{lang}"

        logger.info(f"🧠 {lang} 공식문서 임베딩 시작...")

        vectorstore = Chroma(
            collection_name=collection_name,
            persist_directory=persist_path,
            embedding_function=embedding,
        )

        vectorstore.add_texts([content])
        vectorstore.persist()

        logger.info(f"✅ {lang} 공식문서 임베딩 완료 → {persist_path}")


if __name__ == "__main__":
    embed_style_guides()
    logger.info("🎉 모든 공식문서 임베딩 완료!")
