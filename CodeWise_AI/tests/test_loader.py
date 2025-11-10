import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from rag.loader import load_documents

if __name__ == "__main__":
    docs = load_documents()
    print(f"총 문서 수: {len(docs)}")
    if docs:
        print(docs[0][:200])
