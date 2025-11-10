import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from rag.retriever import retrieve_similar_docs
from rag.generator import generate_answer

query = "메서드명은 어떻게 작성하는 게 좋을까요?"

# 관련 문서 검색
docs = retrieve_similar_docs(query, 1, "java", top_k=3)

# 답변 생성
answer = generate_answer(query, docs)

print("\n=== AI 답변 ===\n")
print(answer)
