class GraphState(dict):
    """
    LangGraph 전체에서 공유되는 상태(State) 정의.
    각 노드(retrieve, generate 등)는 이 상태를 입력받고 수정하여 다음 노드로 전달함.
    """

    question: str  # 사용자가 입력한 질문
    refined_question: str  # rewrite_node에서 재작성된 질문 (웹 검색용)
    context_docs: list  # retriever 결과 - 문서 chunk 리스트
    answer: str  # LLM 생성 결과 - 최종 응답 텍스트
    repo_id: int  # 질문이 속한 레포 ID
    language: str  # 레포의 대표 언어
    route: str  # 의도 분기 결과 (in_scope / out_of_scope)
    grade_result: str  # 문서 평가 결과 (good / rewrite)
