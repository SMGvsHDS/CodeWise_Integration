"""
LangGraph 그래프 구성기 (Graph Builder)
-------------------------------------
각 노드(retrieval, generation, fallback)를 LangGraph 그래프로 연결한다.
"""

from langgraph.graph import StateGraph, END
from .graph_state import GraphState
from .graph_nodes import (
    intent_classifier_node,
    retrieval_node,
    grade_documents_node,
    rewrite_node,
    web_search_node,
    generation_node,
    fallback_node,
)
from utils.logger import setup_logger

logger = setup_logger()


def build_graph():
    """
    LangGraph 그래프를 구성하고 컴파일하여 반환한다.
    """

    logger.info("🧩 LangGraph 그래프 구성 시작...")

    # 1. 그래프 객체 생성
    graph = StateGraph(GraphState)

    # 2. 노드 등록
    graph.add_node("intent", intent_classifier_node)
    graph.add_node("retrieve", retrieval_node)
    graph.add_node("grade", grade_documents_node)
    graph.add_node("rewrite", rewrite_node)
    graph.add_node("web_search", web_search_node)
    graph.add_node("generate", generation_node)
    graph.add_node("fallback", fallback_node)

    # 3. 시작 노드 설정
    graph.set_entry_point("intent")

    # 4. 조건에 따라 노드 연결
    graph.add_conditional_edges(
        "intent",
        lambda state: state.get("route", "fallback"),
        {
            "in_scope": "retrieve",
            "out_of_scope": "fallback",
        },
    )

    graph.add_edge("retrieve", "grade")

    graph.add_conditional_edges(
        "grade",
        lambda state: state.get("grade_result", "rewrite"),
        {
            "good": "generate",
            "rewrite": "rewrite",
        },
    )

    graph.add_conditional_edges(
        "rewrite",
        lambda state: state.get("route", ""),
        {
            "web_search": "web_search",
            "fallback": "fallback",
        },
    )

    graph.add_conditional_edges(
        "web_search",
        lambda state: state.get("route", ""),
        {
            "generate": "generate",
            "fallback": "fallback",
        },
    )

    graph.add_edge("generate", END)
    graph.add_edge("fallback", END)

    # 5. 그래프 컴파일
    compiled_graph = graph.compile()
    logger.info("✅ LangGraph 그래프 구성 완료.")

    return compiled_graph
