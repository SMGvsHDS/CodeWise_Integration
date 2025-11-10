import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from graph.graph_builder import build_graph

if __name__ == "__main__":
    print("🧩 LangGraph 그래프 컴파일 테스트 시작...\n")

    try:
        graph = build_graph()  # 내부에서 compile() 수행됨
        print("✅ 그래프 컴파일 완료!")
        print("📦 그래프 구조:", graph)
    except Exception as e:
        print("❌ 그래프 컴파일 실패:", e)
