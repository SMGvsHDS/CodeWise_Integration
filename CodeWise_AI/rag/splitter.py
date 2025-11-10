"""
문서 청크 분할 모듈
-------------------
긴 문서를 청크 단위로 나누어 임베딩 효율을 높인다.
"""

from langchain.text_splitter import RecursiveCharacterTextSplitter
from utils.logger import setup_logger

logger = setup_logger()


def split_documents(
    documents: list[dict], chunk_size: int = 500, chunk_overlap: int = 50
) -> list[str]:
    """
    긴 텍스트 문서를 청크 단위로 분할한다.
    Args:
        documents (list[dict]): {"title": str, "content": str, "repo_id": int}
        chunk_size (int): 청크의 최대 길이
        chunk_overlap (int): 청크 간 겹치는 길이
    Returns:
        list[dict]: {"text": str, "repo_id": int, "title": str}
    """
    if not documents:
        logger.warning("⚠️ 분할할 문서가 없습니다.")
        return []

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " "],
    )

    chunks = []
    for doc in documents:
        content = doc.get("content", "")
        repo_id = doc.get("repo_id")
        title = doc.get("title", "unknown")

        if not content.strip():
            continue

        split_texts = splitter.split_text(content)
        for i, chunk_text in enumerate(split_texts):
            chunks.append(
                {"text": chunk_text, "repo_id": repo_id, "title": f"{title}_part{i+1}"}
            )

    logger.info(
        f"📚 청크 분할 완료: {len(chunks)}개 (chunk_size={chunk_size}, overlap={chunk_overlap})"
    )
    return chunks
