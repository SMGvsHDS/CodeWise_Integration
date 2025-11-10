import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from rag.loader import load_documents
from rag.splitter import split_documents
from rag.vectorstore import add_documents

if __name__ == "__main__":
    repo_id = 1  # 예시 레포 ID

    docs = load_documents(repo_id=repo_id)
    chunks = split_documents(docs)
    add_documents(repo_id, chunks)
    print(f"✅ repo_{repo_id}_conventions 컬렉션에 초기 임베딩 완료 및 저장 완료!")
