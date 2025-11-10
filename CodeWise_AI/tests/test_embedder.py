import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from rag.loader import load_documents
from rag.splitter import split_documents
from rag.embedder import embed_texts

# 문서 로드
docs = load_documents()

# 문서 청크 분할
chunks = split_documents(docs, chunk_size=500, chunk_overlap=50)
print(f"청크 개수: {len(chunks)}")

# 임베딩 생성
embeddings = embed_texts(chunks)

# 결과 확인
print(f"임베딩 개수: {len(embeddings)}")
print(f"첫 번째 임베딩 길이: {len(embeddings[0])}")
