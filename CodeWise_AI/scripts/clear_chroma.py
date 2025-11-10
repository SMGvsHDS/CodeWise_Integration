"""
로컬에 저장된 벡터 DB(Chroma)를 완전히 초기화한다.
"""

import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from rag.vectorstore import clear_vectorstore

if __name__ == "__main__":
    confirm = input("⚠️ 정말로 Chroma DB를 모두 삭제할까요? (y/N): ").strip().lower()
    if confirm == "y":
        clear_vectorstore()
        print("🧹 Chroma DB 전체 삭제 완료!")
    else:
        print("🚫 취소됨 — 데이터는 그대로 유지됩니다.")
