"""
LangGraph 노드 정의 모듈
각 노드는 QAState를 입력받아 특정 작업(retrieve, generate, fallback 등)을 수행한 뒤
상태를 갱신하여 반환합니다.
"""

from rag.retriever import retrieve_similar_docs as retrieve_docs
from rag.generator import generate_answer
from rag.rewriter import rewrite_question
from rag.websearch import perform_web_search
from rag.grader import grade_documents
from rag.intent_classifier import classify_intent
from rag.fallback import generate_fallback_answer
from utils.logger import setup_logger
from colorama import Fore

logger = setup_logger()


# 1. 질문 의도 판별
def intent_classifier_node(state):
    question = state.get("question", "")
    route = classify_intent(question)
    return {**state, "route": route}


# 2. 검색 노드 — 질문에 대한 관련 문서 검색
def retrieval_node(state):
    question = state["question"]
    repo_id = state.get("repo_id", 1)
    language = state.get("language", "Java")
    logger.info(
        f"📖 [Retrieval Node] 질문 수신: {question} (repo_id={repo_id}, lang={language})"
    )

    docs = retrieve_docs(query=question, repo_id=repo_id, language=language, top_k=3)
    logger.info(f"🔍 검색된 문서 수: {len(docs)}")

    return {**state, "context_docs": docs}


# 3. 검색 결과 평가 노드 - 검색 결과의 품질을 판단하여 'good' 또는 'rewrite'로 분기
def grade_documents_node(state):
    docs = state.get("context_docs", [])
    result = grade_documents(docs)
    return {**state, "grade_result": result}


# 4. rewrite 노드 - 검색 결과가 부적합할 때 쿼리 재정의.
def rewrite_node(state):
    question = state.get("question", "").strip()

    # 질문이 비어 있을 때는 재작성 불가 → fallback 분기
    if not question:
        logger.warning(Fore.YELLOW + "⚠️ 질문이 비어 있음 → fallback 분기")
        return {**state, "refined_question": "", "route": "fallback"}

    rewritten = rewrite_question(question)
    if rewritten:
        return {**state, "refined_question": rewritten, "route": "web_search"}
    else:
        return {**state, "refined_question": question, "route": "fallback"}


# 5. Web-Search 노드 - 재작성된 질문으로 웹 검색 수행
def web_search_node(state):
    question = state.get("refined_question") or state.get("question", "").strip()
    docs = perform_web_search(question)

    if not docs or docs[0]["score"] == 0:
        return {**state, "context_docs": [], "route": "fallback"}

    return {**state, "context_docs": docs, "route": "generate"}


# 답변 생성 노드 — 검색된 문서 기반으로 LLM이 응답 생성
def generation_node(state):
    question = state["question"]
    docs = state["context_docs"]
    logger.info(f"💬 [Generation Node] 문서 기반 답변 생성 시작 (문서 수: {len(docs)})")

    answer = generate_answer(question, docs)
    logger.info("✅ 답변 생성 완료.")

    return {**state, "answer": answer}


# 폴백 노드 — 검색 결과가 없을 경우 대체 응답 반환
def fallback_node(state):
    question = state["question"]
    route = state.get("route", "fallback")

    answer = generate_fallback_answer(question, route)
    return {**state, "answer": answer}
