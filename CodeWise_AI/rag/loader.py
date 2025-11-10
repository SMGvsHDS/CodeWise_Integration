"""
문서 로드 모듈
--------------
공식 컨벤션 / 사용자 컨벤션 / 로컬 문서를 불러와
텍스트 리스트 형태로 반환한다.
"""

import os
from utils.logger import setup_logger

logger = setup_logger()


def load_documents(base_path: str = "./docs", repo_id: int | None = None):
    """
    지정된 폴더 내의 모든 .txt 파일을 읽어 리스트로 반환.
    - repo_id가 없으면 모든 레포 폴더의 문서를 불러옴 (초기 임베딩용)
    - repo_id가 있으면 해당 repo만 불러옴 (부분 업데이트용)
    """
    documents = []
    targets = []

    # repo_id가 있으면 해당 폴더만
    if repo_id:
        repo_path = os.path.join(base_path, f"repo_{repo_id}")
        if not os.path.exists(repo_path):
            logger.warning(f"⚠️ repo_{repo_id} 폴더가 없습니다. 기본 경로로 시도합니다.")
        targets = [repo_path]
    else:
        # 없으면 docs/ 하위의 모든 repo_* 폴더 순회
        targets = [
            os.path.join(base_path, d)
            for d in os.listdir(base_path)
            if d.startswith("repo_") and os.path.isdir(os.path.join(base_path, d))
        ]
        if not targets:
            targets = [base_path]  # fallback: docs 루트 전체

    # 각 폴더 내 txt 파일 로드
    for folder in targets:
        for root, _, files in os.walk(folder):
            for file in files:
                if file.endswith(".txt"):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read().strip()
                            if content:
                                documents.append(
                                    {
                                        "title": os.path.splitext(file)[0],
                                        "content": content,
                                        "repo_id": (
                                            int(folder.split("_")[-1])
                                            if "repo_" in folder
                                            else None
                                        ),
                                    }
                                )
                                logger.info(f"📄 Loaded: {file_path}")
                    except OSError as e:
                        logger.error(f"❌ Failed to load {file_path}: {e}")

    logger.info(
        f"✅ 총 {len(documents)}개 문서 로드 완료. (repo_id={repo_id if repo_id else 'ALL'})"
    )
    return documents
