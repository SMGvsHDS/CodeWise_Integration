"""
문서 검색기 (Retriever)
-----------------------
사용자의 질문 + 코드 스니펫을 벡터화하여 Chroma DB에서 유사한 문서를 검색한다.
검색 결과는 RAG 파이프라인의 컨텍스트로 전달된다.
"""

import os
import hashlib
import time
from functools import lru_cache
from rag.vectorstore import get_vectorstore
from rag.embedder import get_embedder
from utils.logger import setup_logger
from langchain_community.vectorstores import Chroma

logger = setup_logger()

# 쿼리 캐시 (in-memory)
_query_cache = {}


def normalize_query(text: str) -> str:
    import re

    return re.sub(r"[\s?!.은는이가요]", "", text.strip().lower())


def _get_official_vectorstore(folder_path: str, embedder):
    """공식 문서용 Chroma VectorStore 로드 (폴더 경로 → 안전한 이름 변환)"""
    # collection_name에서 './chroma_db/' 제거 + 슬래시를 언더바로 변환
    rel_path = folder_path.replace("./chroma_db/", "").replace("\\", "/")
    collection_name = rel_path.replace("/", "_")

    return Chroma(
        persist_directory=folder_path,
        collection_name=collection_name,
        embedding_function=embedder,
    )


# 🔹 언어별 자동 컬렉션 탐색 (하위폴더 포함)
@lru_cache(maxsize=None)
def _get_target_collections(language: str, repo_id: int, max_official: int = 10):
    """
    언어별 검색 대상 컬렉션 자동 탐색
    - repo_n_conventions + style_guides_{lang} 하위 폴더 모두 탐색
    - 중복 제거 및 정렬
    """
    lang = language.lower()
    base_path = "./chroma_db"
    base = [f"repo_{repo_id}_conventions"]
    matched = set()

    try:
        # ✅ 모든 하위폴더 순회
        for root, dirs, _ in os.walk(base_path):
            for d in dirs:
                folder_rel = os.path.relpath(os.path.join(root, d), base_path)
                if folder_rel.startswith(f"style_guides_{lang}"):
                    matched.add(folder_rel)

        matched = sorted(list(matched))[:max_official]
        collections = base + matched
        logger.info(f"📂 [{lang}] 검색 대상 컬렉션 자동 탐색 완료 → {collections}")
        return collections

    except Exception as e:
        logger.warning(f"⚠️ 컬렉션 탐색 중 오류 발생: {e}")
        return base


def retrieve_similar_docs(
    query: str,
    repo_id: int,
    language: str,
    top_k: int = 3,
    code_snippet: str | None = None,
):
    """
    질문(query)과 선택적으로 제공된 코드(code_snippet)를 벡터화하여
    Chroma DB에서 유사한 문서를 top_k개 검색한다.

    Args:
        question (str): 사용자 질문
        repo_id (int): 질문이 속한 레포 ID
        language (str): 레포의 대표 언어 (예: "Java", "Python")
        top_k (int): 검색할 문서 개수
        code_snippet (str | None): 선택적 코드 조각 (있을 경우 검색 정확도 강화)

    Returns:
        list[dict]: { 'content': 문서 내용, 'score': 유사도 점수, 'source': 출처 } 리스트
    """
    start_time = time.time()
    try:
        logger.info(
            f"🔍 [Retriever] 문서 검색 시작 — repo_id={repo_id}, lang={language}, "
            f"query='{query}', code_snippet={'O' if code_snippet else 'X'}, top_k={top_k}"
        )

        embedder = get_embedder()
        cache_key = hashlib.md5(normalize_query(query).encode("utf-8")).hexdigest()

        # 1. 쿼리 벡터 캐시 확인
        if cache_key in _query_cache:
            logger.info("⚡ 캐시된 쿼리 벡터 사용")
        else:
            _ = embedder.embed_query(query)  # 실제 embedding은 내부적으로 캐시
            _query_cache[cache_key] = True  # 단순 호출 기록 (embedding 호출 방지)
            logger.info("🧠 새 쿼리 임베딩 계산 완료 (캐시 저장)")

        # 2. 코드 스니펫 병합 (검색 정확도 향상)
        # 질문 + 코드 모두 존재하면, 문맥 결합 후 검색 질의 강화
        search_query = query
        if code_snippet:
            logger.info("💡 코드 스니펫 기반 문맥 결합 검색 수행")
            search_query = f"{query}\n\n코드 내용:\n{code_snippet}"

        # ✅ 검색 대상 컬렉션 탐색
        collections = _get_target_collections(language, repo_id)
        logger.info(f"📚 검색 대상 컬렉션: {collections}")

        all_results = []

        # ✅ 1️⃣ repo 컨벤션 문서 검색 (항상 포함)
        try:
            repo_vectorstore = get_vectorstore(repo_id)
            repo_results = repo_vectorstore.similarity_search_with_score(
                search_query, k=top_k
            )
            for doc, score in repo_results:
                all_results.append(
                    {
                        "content": doc.page_content,
                        "score": score,
                        "source": f"repo_{repo_id}_conventions",
                    }
                )
            logger.info(
                f"📘 [REPO] repo_{repo_id}_conventions 검색 완료 ({len(repo_results)}개)"
            )
        except Exception as e:
            logger.warning(f"⚠️ repo 컨벤션 검색 실패: {e}")

        # ✅ 2️⃣ 공식 문서 검색 (언어별)
        for name in collections:
            if name.startswith("repo_"):
                continue  # repo는 이미 검색함
            folder_path = f"./chroma_db/{name}"
            try:
                vectorstore = _get_official_vectorstore(folder_path, embedder)
                results = vectorstore.similarity_search_with_score(
                    search_query, k=top_k
                )
                for doc, score in results:
                    all_results.append(
                        {"content": doc.page_content, "score": score, "source": name}
                    )
                logger.debug(f"📘 [OFFICIAL] {name} 검색 완료 ({len(results)}개)")
            except Exception as e:
                logger.warning(f"⚠️ {name} 검색 중 오류 발생: {e}")

        # ✅ 3️⃣ repo 우선 정렬 후 반환
        sorted_docs = sorted(
            all_results,
            key=lambda x: (0 if "repo_" in x["source"] else 1, x["score"]),
        )

        elapsed = time.time() - start_time
        logger.info(f"✅ 문서 검색 완료 (repo + official). ⏱ {elapsed:.2f}s")
        logger.info(f"📄 포함 문서 출처: {[d['source'] for d in sorted_docs]}")

        return sorted_docs

    except Exception as e:
        logger.error(f"❌ 유사 문서 검색 실패: {e}")
        raise
