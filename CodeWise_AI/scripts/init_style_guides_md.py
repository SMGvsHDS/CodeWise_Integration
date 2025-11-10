"""
공식 스타일 가이드 임베딩 스크립트 (언어별/문서별 컬렉션 자동 분리)
------------------------------------------------------------------
docs/style_guides/ 하위 폴더 구조를 탐색하여,
각 .md 파일을 개별 Chroma 컬렉션으로 임베딩한다.

예: docs/style_guides/java/java_performance_tuning.md
→ style_guides_java_java_performance_tuning
"""

import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from rag.embedder import get_embedder
from langchain_community.vectorstores import Chroma
from utils.logger import setup_logger
from langchain.text_splitter import RecursiveCharacterTextSplitter


logger = setup_logger()

STYLE_GUIDE_PATH = "./docs/style_guides"
CHROMA_PATH = "./chroma_db"


# ✅ 안전한 배치 단위 (Chroma 내부 제한 고려)
MAX_BATCH_SIZE = 5000
MAX_WORKERS = 2  # ✅ 병렬 프로세스 개수 (CPU 코어 수에 맞게 조정)


def process_file(file_path, embedding):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=2500,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " "],
    )

    file = os.path.basename(file_path)
    rel_path = os.path.relpath(
        os.path.dirname(file_path), STYLE_GUIDE_PATH
    )  # 예: spring/core/aop/api/pfb
    name = os.path.splitext(file)[0]  # 예: pfb.md → pfb

    # 🔹 언어는 최상위 폴더명 (spring, java 등)
    lang_dir = rel_path.split("/")[0]

    # 🔹 컬렉션명은 path를 _로 변환한 문자열
    collection_name = f"style_guides_{rel_path.replace('/', '_')}_{name}"

    safe_rel_path = rel_path.replace("\\", "/")  # ✅ 윈도우 경로 대응
    # 🔹 저장 경로는 실제 폴더 구조 그대로 유지
    persist_path = os.path.join(CHROMA_PATH, "style_guides_" + rel_path, name)

    # ✅ 이미 존재하면 스킵
    if os.path.exists(persist_path):
        return f"⏭ 스킵: {file} (이미 존재)"

    os.makedirs(persist_path, exist_ok=True)  # ✅ 중첩 폴더 자동 생성

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read().strip()
    if not content:
        return f"⚠️ 비어 있음: {file}"

    vectorstore = Chroma(
        collection_name=collection_name,
        persist_directory=persist_path,
        embedding_function=embedding,
    )

    chunks = splitter.split_text(content)
    total_chunks = len(chunks)
    for i in range(0, total_chunks, MAX_BATCH_SIZE):
        batch = chunks[i : i + MAX_BATCH_SIZE]
        vectorstore.add_texts(batch)

    return f"✅ 완료: {file} ({total_chunks} chunks)"


def embed_style_guides():
    """모든 Markdown 문서를 병렬 임베딩 (스레드 기반)"""
    start_time = time.time()

    all_md_files = []
    for root, _, files in os.walk(STYLE_GUIDE_PATH):
        for file in files:
            if file.endswith(".md"):
                all_md_files.append(os.path.join(root, file))

    total_files = len(all_md_files)
    logger.info(
        f"📚 총 {total_files}개의 Markdown 문서를 임베딩합니다 (스레드 {MAX_WORKERS}개)\n"
    )

    # ✅ 임베더 1회만 초기화
    embedding = get_embedder()
    logger.info("🧠 Upstage 임베더 초기화 완료 (1회만 실행)\n")

    results = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(process_file, f, embedding): f for f in all_md_files}
        for future in tqdm(
            as_completed(futures),
            total=total_files,
            ncols=90,
            desc="🚀 Embedding Progress",
        ):
            try:
                results.append(future.result())
            except Exception as e:
                results.append(f"❌ 오류: {e}")

    elapsed = time.time() - start_time
    logger.info("\n📦 임베딩 결과 요약 -------------------------------")
    for r in results:
        logger.info(r)
    logger.info(
        f"\n🎉 모든 Markdown 스타일 가이드 임베딩 완료! 총 소요시간: {elapsed:.1f}s"
    )


if __name__ == "__main__":
    embed_style_guides()
