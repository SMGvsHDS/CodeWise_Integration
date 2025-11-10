"""
Chroma 벡터스토어 관리 모듈
---------------------------
레포별 문서를 개별 컬렉션에 임베딩하고,
검색 / 삭제 / 초기화를 수행한다.
"""

import os
import shutil
from langchain.vectorstores import Chroma
from utils.logger import setup_logger
from utils.config import CHROMA_PATH
from langchain.schema import Document
from functools import lru_cache
from rag.embedder import get_embedder

logger = setup_logger()

# ✅ 전역 캐시 (VectorStore 재사용)
_vectorstore_cache = {}


def _load_vectorstore(repo_id: int):
    """내부 함수 — 실제 Chroma 객체 로드"""
    embedding = get_embedder()
    persist_path = f"{CHROMA_PATH}/repo_{repo_id}"

    vectorstore = Chroma(
        collection_name=f"repo_{repo_id}_conventions",
        persist_directory=persist_path,
        embedding_function=embedding,
    )
    logger.info(f"✅ Chroma VectorStore 로드 완료 (repo_id={repo_id})")
    return vectorstore


@lru_cache(maxsize=None)
def get_vectorstore(repo_id: int):
    """
    특정 레포(repo_id)에 해당하는 Chroma 컬렉션 로드
    """
    if repo_id in _vectorstore_cache:
        return _vectorstore_cache[repo_id]

    try:
        vectorstore = _load_vectorstore(repo_id)
        _vectorstore_cache[repo_id] = vectorstore
        logger.info(f"✅ Chroma VectorStore 로드 완료 (repo_id={repo_id})")
        return vectorstore

    except Exception as e:
        logger.error(f"❌ VectorStore 로드 실패 (repo_id={repo_id}): {e}")
        raise


def add_single_convention(
    repo_id: int, title: str, language: str, content: str, convention_id: int
):
    """
    단일 코드 컨벤션을 벡터스토어(Chroma)에 추가.
    - Upstage Embedding API를 통해 content → 벡터 변환
    - 해당 레포의 컬렉션에 벡터 + 메타데이터 저장
    """
    try:
        embedder = get_embedder()  # Upstage Embeddings
        persist_path = f"{CHROMA_PATH}/repo_{repo_id}"
        os.makedirs(persist_path, exist_ok=True)

        # 텍스트 → 임베딩 벡터 생성
        vector = embedder.embed_query(content)
        logger.info(f"🧠 Embedding 생성 완료 (dim={len(vector)})")

        # Chroma 컬렉션 로드
        vectorstore = get_vectorstore(repo_id)

        # 문서 및 메타데이터 구성
        doc = Document(
            page_content=content,
            metadata={"repo_id": repo_id, "title": title, "language": language},
        )

        # Chroma에 벡터 추가
        vectorstore.add_documents([doc], ids=[str(convention_id)])
        vectorstore.persist()

        logger.info(
            f"✅ 컨벤션(id={convention_id}) '{title}' 임베딩 + 저장 완료 (repo_{repo_id}_conventions)"
        )

    except Exception as e:
        logger.error(f"❌ 컨벤션 임베딩 실패 (repo_id={repo_id}): {e}")
        raise


def add_documents(repo_id: int, docs: list[dict]):
    """
    문서(청크 리스트)를 벡터스토어에 추가하고 저장.
    - docs: [{"text": str, "repo_id": int, "title": str}, ...]
    """
    try:
        vectorstore = get_vectorstore(repo_id)

        # 텍스트와 메타데이터를 분리
        texts = [d["text"] for d in docs]
        metadatas = [{"title": d["title"], "repo_id": repo_id} for d in docs]

        # 임베딩 + 저장
        vectorstore.add_texts(texts=texts, metadatas=metadatas)
        vectorstore.persist()  # 디스크에 저장

        logger.info(f"💾 {len(texts)}개 문서 저장 완료 (repo_{repo_id}_conventions)")
    except Exception as e:
        logger.error(f"❌ 문서 추가 실패 (repo_id={repo_id}): {e}")
        raise


def get_conventions_by_repo(repo_id: int):
    """
    특정 레포(repo_id)의 컨벤션 목록을 벡터DB(Chroma)에서 조회.
    - 저장된 문서 내용(page_content)과 메타데이터(title, language 등)를 반환.
    """
    try:
        vectorstore = get_vectorstore(repo_id)

        # Chroma에서 전체 데이터 로드
        results = vectorstore.get(include=["documents", "metadatas"])

        ids = results.get("ids", [])
        documents = results.get("documents", [])
        metadatas = results.get("metadatas", [])

        # content + metadata 묶어서 반환
        conventions = [
            {"id": id_, "content": doc, "metadata": meta}
            for id_, doc, meta in zip(ids, documents, metadatas)
        ]

        logger.info(
            f"📘 repo_{repo_id}_conventions 에서 {len(conventions)}개 컨벤션 로드 완료"
        )
        return conventions

    except Exception as e:
        logger.error(f"❌ 컨벤션 조회 실패 (repo_id={repo_id}): {e}")
        raise


def delete_convention(repo_id: int, convention_id: int):
    """
    특정 컨벤션을 ChromaDB에서 삭제.
    """
    try:
        vectorstore = get_vectorstore(repo_id)
        vectorstore.delete(ids=[str(convention_id)])
        vectorstore.persist()
        logger.info(f"🗑️ 컨벤션 삭제 완료 (repo_id={repo_id}, id={convention_id})")
    except Exception as e:
        logger.error(
            f"❌ 컨벤션 삭제 실패 (repo_id={repo_id}, id={convention_id}): {e}"
        )
        raise


def update_convention(
    repo_id: int, convention_id: int, title: str, language: str, content: str
):
    """
    기존 컨벤션 수정 (삭제 후 재임베딩)
    """
    try:
        embedder = get_embedder()
        persist_path = f"{CHROMA_PATH}/repo_{repo_id}"
        os.makedirs(persist_path, exist_ok=True)

        collection_name = f"repo_{repo_id}_conventions"
        vectorstore = Chroma(
            collection_name=collection_name,
            persist_directory=persist_path,
            embedding_function=embedder,
        )

        # 기존 벡터 삭제
        vectorstore.delete(ids=[str(convention_id)])
        logger.info(f"🗑️ 기존 컨벤션 삭제 (id={convention_id})")

        # 새 내용으로 재임베딩 후 저장
        doc = Document(
            page_content=content,
            metadata={"repo_id": repo_id, "title": title, "language": language},
        )
        vectorstore.add_documents([doc], ids=[str(convention_id)])
        vectorstore.persist()

        logger.info(
            f"🔁 컨벤션 수정 완료 (repo_id={repo_id}, id={convention_id}, title={title})"
        )

    except Exception as e:
        logger.error(
            f"❌ 컨벤션 수정 실패 (repo_id={repo_id}, id={convention_id}): {e}"
        )
        raise


def clear_vectorstore(repo_id: int | None = None):
    """
    Chroma DB 전체 또는 특정 레포만 삭제.
    """
    try:
        if repo_id:
            target_path = f"{CHROMA_PATH}/repo_{repo_id}"
            shutil.rmtree(target_path, ignore_errors=True)
            logger.warning(f"🧹 repo_{repo_id} 벡터스토어 삭제 완료.")
        else:
            shutil.rmtree(CHROMA_PATH, ignore_errors=True)
            logger.warning("🧹 전체 Chroma VectorStore 초기화 완료.")
    except Exception as e:
        logger.error(f"❌ VectorStore 삭제 실패: {e}")
        raise
