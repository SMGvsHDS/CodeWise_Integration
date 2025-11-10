import re

# ✅ 컬렉션명 기반 공식 URL 매핑
COLLECTION_URLS = {
    # 🌐 Web / Frontend
    "style_guides_angularjs_styleguide": "https://google.github.io/styleguide/angularjs-google-style.html",
    "style_guides_htmlcss_styleguide": "https://google.github.io/styleguide/htmlcssguide.html",
    "style_guides_javascript_styleguide": "https://google.github.io/styleguide/jsguide.html",
    "style_guides_javascript_airbnb_styleguide": "https://github.com/airbnb/javascript",
    "style_guides_typescript_styleguide": "https://google.github.io/styleguide/tsguide.html",
    "style_guides_vimscript_styleguide": "https://google.github.io/styleguide/vimscriptguide.xml",
    # 💻 C-family
    "style_guides_cpp_styleguide": "https://google.github.io/styleguide/cppguide.html",
    "style_guides_csharp_styleguide": "https://google.github.io/styleguide/csharp-style.html",
    # 🧩 Java
    "style_guides_java_styleguide": "https://google.github.io/styleguide/javaguide.html",
    "style_guides_java_effective_styleguide": "https://github.com/HugoMatilla/Effective-JAVA-Summary",
    "style_guides_java_performance_tuning": "https://docs.oracle.com/javase/tutorial/essential/environment/",
    "style_guides_java_secure_coding_guidelines": "https://www.oracle.com/java/technologies/javase/seccodeguide.html",
    # 🐍 Python
    "style_guides_python_styleguide": "https://google.github.io/styleguide/pyguide.html",
    "style_guides_python_pep8_styleguide": "https://peps.python.org/pep-0008/",
    "style_guides_python_performance_tips": "https://wiki.python.org/moin/PythonSpeed/PerformanceTips",
    # ☕ Spring / Java Frameworks
    "style_guides_spring": "https://docs.spring.io/spring-framework/reference/",
    # 🐹 Go / R / Swift / Shell
    "style_guides_go_styleguide": "https://google.github.io/styleguide/go/",
    "style_guides_r_styleguide": "https://google.github.io/styleguide/Rguide.html",
    "style_guides_swift_styleguide": "https://google.github.io/swift/",
    "style_guides_shell_styleguide": "https://google.github.io/styleguide/shellguide.html",
    # 🧠 General / Patterns / Security
    "style_guides_general_big_o_cheatsheet": "https://www.bigocheatsheet.com/",
    "style_guides_general_clean_code_summary": "https://github.com/JuanCrg90/Clean-Code-Notes",
    "style_guides_general_design_patterns": "https://refactoring.guru/design-patterns",
    "style_guides_general_owasp_top10": "https://owasp.org/Top10/",
    "style_guides_general_solid_principles": "https://en.wikipedia.org/wiki/SOLID",
    # 📄 Docs (문서 작성 규칙)
    "style_guides_docs_styleguide": "https://google.github.io/styleguide/docguide/style.html",
}


def linkify_reference(ref_text: str, collection_name: str | None = None) -> str:
    """
    🔗 컬렉션명 기반 공식 문서 링크 자동 변환
    - ref_text: 모델이 생성한 reference 문자열 (예: "Google Java Style Guide §5.2.1 Class Names")
    - collection_name: Chroma 컬렉션명 (예: style_guides_java_styleguide)
    """
    ref_text = ref_text.strip()

    if "사용자 코드 컨벤션" in ref_text or "repo" in (collection_name or "").lower():
        return ref_text  # 링크 붙이지 않음

    # 이미 링크면 그대로 반환
    if "http" in ref_text:
        return ref_text

    # 1️⃣ 컬렉션명 기반 매칭
    if collection_name:
        for key, url in COLLECTION_URLS.items():
            if key in collection_name.lower():
                return f"[{ref_text}]({url})"

    # 2️⃣ ref_text 내용 기반 추론 (fallback)
    ref_lower = ref_text.lower()
    for key, url in COLLECTION_URLS.items():
        if any(word in ref_lower for word in key.split("_")):
            return f"[{ref_text}]({url})"

    # 3️⃣ 그래도 못 찾으면 검색 링크로
    return ""
