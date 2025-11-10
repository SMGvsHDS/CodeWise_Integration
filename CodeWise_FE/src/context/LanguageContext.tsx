import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navbar
    'nav.organizations': 'Organizations',
    'nav.repositories': 'Repositories',
    'nav.settings': 'Settings',
    'nav.language': 'Language',
    'nav.logout': 'Log out',
    
    // Organizations
    'org.title': 'Select Organization',
    'org.subtitle': 'Choose an organization to view its repositories',
    'org.error': 'Failed to load organizations',
    'org.error_hint': 'Please refresh or try again in a moment.',
    'org.retry': 'Retry',
    'org.empty': 'No organizations connected yet',
    'org.empty_hint': 'Connect your GitHub account or synchronize organizations from the backend.',
    
    // Repositories
    'repo.title': 'Select Repository',
    'repo.subtitle': 'Choose a repository to start code review',
    'repo.manage_conventions': 'Manage Conventions',
    'repo.public': 'public',
    'repo.private': 'private',
    'repo.selected_org': 'Currently viewing',
    'repo.error': 'Failed to load repositories',
    'repo.error_hint': 'Please refresh or try again in a moment.',
    'repo.retry': 'Retry',
    'repo.empty': 'No repositories available yet',
    'repo.empty_hint': 'Synchronize repositories or check your GitHub permissions.',
    'repo.no_description': 'No description provided.',
    
    // Code Review
    'review.title': 'Review',
    'review.your_code': 'Your Code',
    'review.ai_assistant': 'AI Assistant',
    'review.paste_code': 'Paste your code here...',
    'review.ask_question': 'Ask a question about your code...',
    'review.ask_ai': 'Ask AI',
    'review.analyzing': 'Analyzing...',
    'review.welcome': "Hello! I'm Codewise AI 🤖. Paste your code and ask me anything about code review, best practices, or conventions.",
    'review.repository': 'Repository',
    'review.default_prompt': 'Please review this code.',
    'review.failed_to_answer': 'AI could not generate an answer.',
    'review.toast_question_failed': 'Failed to submit the question.',
    'review.toast_questions_load_failed': 'Failed to load previous questions.',
    'review.toast_sessions_load_failed': 'Failed to load chats.',
    'review.toast_session_create_failed': 'Failed to create chat.',
    'review.toast_session_deleted': 'Chat deleted.',
    'review.toast_session_delete_failed': 'Failed to delete chat.',
    'review.toast_generic_error': 'Something went wrong. Please try again.',
    'review.toast_code_required': 'Please enter a question or paste code before asking.',
    'review.back_to_repositories': 'Back to repositories',
    'review.question_history': 'Previous Questions',
    'review.no_history': 'No questions asked yet',
    'review.view_history': 'View history',
    'review.back_to_review': 'Back to review',
    'review.history_description': 'Review all questions previously asked for this repository.',
    'review.history_empty_hint': 'Ask your first question to start building history.',
    'review.ask_new_question': 'Ask a new question',
    'review.question_label': 'Question',
    'review.revisit_question': 'Open in review',
    'review.detail_code': 'Code snippet',
    'review.detail_responses': 'Responses',
    'review.detail_created_at': 'Asked at',
    'review.detail_missing': 'No additional details are available for this question yet.',
    'review.detail_answer': 'AI answer',
    'review.loading_history': 'Loading question history...',
    'review.status.PENDING': 'Pending',
    'review.status.IN_PROGRESS': 'In progress',
    'review.status.ANSWERED': 'Answered',
    'review.status.FAILED': 'Failed',
    'review.detail_status': 'Status',
    'review.detail_language': 'Language',
    'review.detail_model': 'Model',
    'review.detail_tokens': 'Total tokens',
    'review.detail_latency': 'Latency',
    'review.detail_failure_reason': 'Failure reason',
    'review.detail_matched_conventions': 'Matched conventions',
    'review.detail_no_answer': 'AI response is not available yet.',
    'review.no_repo_selected_title': 'Select a repository to start reviewing',
    'review.no_repo_selected_description': 'Pick a repository from the Repositories page to load its previous questions and share new code with the assistant.',
    'review.no_repo_selected_button': 'Go to repositories',
    'review.sessions_title': 'Chats',
    'review.sessions_loading': 'Loading chats...',
    'review.sessions_empty': 'No chats yet. Use New chat to start one.',
    'review.session_delete': 'Delete chat',
    'review.new_chat': 'New chat',
    'review.creating_chat': 'Creating...',
    'review.session_placeholder_title': 'Select a chat to get started',
    'review.session_last_active': 'Last active',
    'review.session_last_active_empty': 'No activity yet',
    'review.session_start_prompt': 'Choose an existing chat on the left or create one with the New chat button above.',
    'review.loading_chat': 'Preparing the conversation...',
    'review.delete_question': 'Delete question',
    'review.delete_question_confirm': 'Delete this question from history?',
    'review.delete_all_history': 'Delete all history',
    'review.delete_all_confirm': 'Delete all question history for this repository?',
    'review.toast_question_deleted': 'Question removed.',
    'review.toast_question_delete_failed': 'Failed to delete question.',
    'review.toast_history_cleared': 'History cleared.',
    'review.toast_history_clear_failed': 'Failed to clear history.',
    'review.deleting': 'Deleting...',
    
    // Conventions
    'conv.title': 'Manage Conventions',
    'conv.subtitle': 'Add and manage code conventions for your organization',
    'conv.add': 'Add Convention',
    'conv.form_title': 'Convention Title',
    'conv.form_language': 'Language',
    'conv.form_content': 'Convention Content',
    'conv.form_title_placeholder': 'e.g., TypeScript Naming Conventions',
    'conv.form_language_placeholder': 'e.g., TypeScript, Python, Go',
    'conv.form_content_placeholder': 'Describe your coding conventions in detail...',
    'conv.save': 'Save Convention',
    'conv.cancel': 'Cancel',
    'conv.delete': 'Delete',
    'conv.no_conventions': 'No conventions added yet',
    'conv.edit': 'Edit',
    'conv.detail_content': 'Content',
    'conv.created_by': 'Created by',
    'conv.created_at': 'Created at',
    'conv.detail_missing': 'Unable to load convention details.',
    'conv.delete_confirm': 'Delete this convention?',
    'conv.edit_title': 'Edit Convention',
    'conv.add_title': 'Add Convention',
    'conv.form_description': 'Provide details about this convention.',
    'conv.repo_label': 'Repository:',
    'conv.repo_unknown': 'Unknown repository',
    'conv.toast_created': 'Convention created successfully.',
    'conv.toast_updated': 'Convention updated successfully.',
    'conv.toast_deleted': 'Convention deleted.',
    'conv.toast_error': 'Action failed',
    'conv.error_generic': 'Something went wrong. Please try again.',
    'conv.error': 'Failed to load conventions',
    'conv.error_hint': 'Please refresh or try again in a moment.',
    'conv.retry': 'Retry',
    'conv.empty_hint': 'Create your first convention to guide contributors.',
    
    // Login
    'login.welcome': 'Welcome to Codewise',
    'login.subtitle': 'AI-powered code review for your GitHub repositories',
    'login.signin': 'Sign in with GitHub',
  },
  ko: {
    // Navbar
    'nav.organizations': '조직',
    'nav.repositories': '레포지토리',
    'nav.settings': '설정',
    'nav.language': '언어',
    'nav.logout': '로그아웃',
    
    // Organizations
    'org.title': '조직 선택',
    'org.subtitle': '레포지토리를 보려면 조직을 선택하세요',
    'org.error': '조직을 불러오지 못했습니다',
    'org.error_hint': '잠시 후 다시 시도하거나 새로고침해주세요.',
    'org.retry': '다시 시도',
    'org.empty': '연결된 조직이 없습니다',
    'org.empty_hint': 'GitHub 계정을 연결하거나 백엔드에서 조직을 동기화하세요.',
    
    // Repositories
    'repo.title': '레포지토리 선택',
    'repo.subtitle': '코드 리뷰를 시작할 레포지토리를 선택하세요',
    'repo.manage_conventions': '컨벤션 관리',
    'repo.public': '공개',
    'repo.private': '비공개',
    'repo.selected_org': '현재 선택한 조직',
    'repo.error': '레포지토리를 불러오지 못했습니다',
    'repo.error_hint': '잠시 후 다시 시도하거나 새로고침해주세요.',
    'repo.retry': '다시 시도',
    'repo.empty': '아직 레포지토리가 없습니다',
    'repo.empty_hint': '백엔드에서 레포지토리를 동기화하거나 GitHub 권한을 확인하세요.',
    'repo.no_description': '설명이 없습니다.',
    
    // Code Review
    'review.title': '리뷰',
    'review.your_code': '코드 입력',
    'review.ai_assistant': 'AI 어시스턴트',
    'review.paste_code': '코드를 여기에 붙여넣으세요...',
    'review.ask_question': '코드에 대해 질문하세요...',
    'review.ask_ai': 'AI에게 질문하기',
    'review.analyzing': '분석 중...',
    'review.welcome': '안녕하세요! Codewise AI 🤖입니다. 코드를 붙여넣고 코드 리뷰, 모범 사례, 컨벤션에 대해 무엇이든 물어보세요.',
    'review.repository': '레포지토리',
    'review.default_prompt': '이 코드를 리뷰해 주세요.',
    'review.failed_to_answer': 'AI가 답변을 생성하지 못했습니다.',
    'review.toast_question_failed': '질문 전송에 실패했습니다.',
    'review.toast_questions_load_failed': '질문 내역을 불러오지 못했습니다.',
    'review.toast_sessions_load_failed': '채팅을 불러오지 못했습니다.',
    'review.toast_session_create_failed': '채팅을 생성하지 못했습니다.',
    'review.toast_session_deleted': '채팅을 삭제했습니다.',
    'review.toast_session_delete_failed': '채팅 삭제에 실패했습니다.',
    'review.toast_generic_error': '오류가 발생했습니다. 다시 시도해주세요.',
    'review.toast_code_required': '질문 또는 코드 중 하나를 입력한 뒤 요청해 주세요.',
    'review.back_to_repositories': '레포지토리 목록으로 돌아가기',
    'review.question_history': '질문 기록',
    'review.no_history': '아직 질문이 없습니다',
    'review.view_history': '기록 보기',
    'review.back_to_review': '리뷰 화면으로 돌아가기',
    'review.history_description': '이 레포지토리에 대해 이전에 했던 질문들을 확인해보세요.',
    'review.history_empty_hint': '첫 질문을 남기면 기록이 쌓이기 시작해요.',
    'review.ask_new_question': '새 질문하기',
    'review.question_label': '질문',
    'review.revisit_question': '리뷰 화면에서 열기',
    'review.detail_code': '코드',
    'review.detail_responses': '답변 수',
    'review.detail_created_at': '작성 시각',
    'review.detail_missing': '이 질문에 대한 추가 상세 정보가 아직 없습니다.',
    'review.detail_answer': 'AI 답변',
    'review.loading_history': '질문 기록을 불러오는 중...',
    'review.status.PENDING': '대기 중',
    'review.status.IN_PROGRESS': '처리 중',
    'review.status.ANSWERED': '답변 완료',
    'review.status.FAILED': '실패',
    'review.detail_status': '상태',
    'review.detail_language': '언어',
    'review.detail_model': '모델',
    'review.detail_tokens': '토큰 수',
    'review.detail_latency': '지연 시간',
    'review.detail_failure_reason': '실패 사유',
    'review.detail_matched_conventions': '매칭된 컨벤션',
    'review.detail_no_answer': 'AI 응답이 아직 준비되지 않았습니다.',
    'review.no_repo_selected_title': '리뷰를 시작할 레포지토리를 선택하세요',
    'review.no_repo_selected_description': '레포지토리 페이지에서 프로젝트를 선택하면 이전 질문과 새로운 코드 질문을 모두 확인할 수 있습니다.',
    'review.no_repo_selected_button': '레포지토리로 이동',
    'review.sessions_title': '채팅 목록',
    'review.sessions_loading': '채팅을 불러오는 중...',
    'review.sessions_empty': '아직 채팅이 없습니다. 위의 새 채팅 버튼을 눌러 시작해 보세요.',
    'review.session_delete': '채팅 삭제',
    'review.new_chat': '새 채팅',
    'review.creating_chat': '생성 중...',
    'review.session_placeholder_title': '채팅을 선택해 시작하세요',
    'review.session_last_active': '마지막 활동',
    'review.session_last_active_empty': '아직 활동이 없습니다',
    'review.session_start_prompt': '좌측에서 기존 채팅을 선택하거나 위의 새 채팅 버튼으로 대화를 시작하세요.',
    'review.loading_chat': '대화를 준비하고 있습니다...',
    'review.delete_question': '질문 삭제',
    'review.delete_question_confirm': '이 질문 기록을 삭제할까요?',
    'review.delete_all_history': '기록 전체 삭제',
    'review.delete_all_confirm': '이 레포지토리의 질문 기록을 모두 삭제할까요?',
    'review.toast_question_deleted': '질문을 삭제했습니다.',
    'review.toast_question_delete_failed': '질문 삭제에 실패했습니다.',
    'review.toast_history_cleared': '기록을 모두 삭제했습니다.',
    'review.toast_history_clear_failed': '기록 삭제에 실패했습니다.',
    'review.deleting': '삭제 중...',
    
    // Conventions
    'conv.title': '컨벤션 관리',
    'conv.subtitle': '조직의 코드 컨벤션을 추가하고 관리하세요',
    'conv.add': '컨벤션 추가',
    'conv.form_title': '컨벤션 제목',
    'conv.form_language': '언어',
    'conv.form_content': '컨벤션 내용',
    'conv.form_title_placeholder': '예: TypeScript 네이밍 컨벤션',
    'conv.form_language_placeholder': '예: TypeScript, Python, Go',
    'conv.form_content_placeholder': '코딩 컨벤션을 자세히 작성하세요...',
    'conv.save': '컨벤션 저장',
    'conv.cancel': '취소',
    'conv.delete': '삭제',
    'conv.no_conventions': '아직 추가된 컨벤션이 없습니다',
    'conv.edit': '수정',
    'conv.detail_content': '내용',
    'conv.created_by': '작성자',
    'conv.created_at': '작성일',
    'conv.detail_missing': '컨벤션 상세를 불러올 수 없습니다.',
    'conv.delete_confirm': '이 컨벤션을 삭제하시겠습니까?',
    'conv.edit_title': '컨벤션 수정',
    'conv.add_title': '컨벤션 추가',
    'conv.form_description': '컨벤션에 대한 자세한 정보를 입력하세요.',
    'conv.repo_label': '레포지토리:',
    'conv.repo_unknown': '알 수 없는 레포지토리',
    'conv.toast_created': '컨벤션이 생성되었습니다.',
    'conv.toast_updated': '컨벤션이 수정되었습니다.',
    'conv.toast_deleted': '컨벤션이 삭제되었습니다.',
    'conv.toast_error': '작업에 실패했습니다',
    'conv.error_generic': '오류가 발생했습니다. 다시 시도해주세요.',
    'conv.error': '컨벤션을 불러오지 못했습니다',
    'conv.error_hint': '잠시 후 다시 시도하거나 새로고침해주세요.',
    'conv.retry': '다시 시도',
    'conv.empty_hint': '첫 번째 컨벤션을 추가해 팀 가이드를 만들어보세요.',
    
    // Login
    'login.welcome': 'Codewise에 오신 것을 환영합니다',
    'login.subtitle': 'GitHub 레포지토리를 위한 AI 기반 코드 리뷰',
    'login.signin': 'GitHub로 로그인',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('codewise-language');
    return (saved === 'ko' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('codewise-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
