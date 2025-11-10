import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from rag.retriever import retrieve_similar_docs

query = "메서드명은 어떻게 지어야 하나요?"
results = retrieve_similar_docs(query, repo_id=1, language="java", top_k=3)

for i, r in enumerate(results, start=1):
    print(f"\n[{i}] 유사도: {r['score']:.4f}")
    print(r["content"][:300], "...")
