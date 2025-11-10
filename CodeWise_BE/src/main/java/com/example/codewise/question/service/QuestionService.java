package com.example.codewise.question.service;

import com.example.codewise.airesponse.service.AiResponseService;
import com.example.codewise.codeconvention.repository.CodeConventionRepository;
import com.example.codewise.common.exception.CustomException;
import com.example.codewise.question.dto.QuestionUpdateRequest;
import com.example.codewise.question.entity.Question;
import com.example.codewise.question.entity.QuestionSession;
import com.example.codewise.question.repository.QuestionRepository;
import com.example.codewise.question.service.client.QuestionAiClient;
import com.example.codewise.repository.entity.Repository;
import com.example.codewise.repository.repository.RepositoryRepository;
import com.example.codewise.user.entity.User;
import com.example.codewise.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * 질문 도메인 서비스.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private static final String DEFAULT_CODE_REVIEW_PROMPT = "이 코드에 대해 리뷰해줘";

    private final QuestionRepository questionRepository;
    private final QuestionSessionService questionSessionService;
    private final RepositoryRepository repositoryRepository;
    private final UserRepository userRepository;
    private final CodeConventionRepository codeConventionRepository;
    private final AiResponseService aiResponseService;
    private final QuestionAiClient questionAiClient;

    @Transactional
    public Question create(Long repoId, Long userId, Long sessionId, String questionText, String codeSnippet) {
        Repository repository = repositoryRepository.findAccessibleById(repoId, userId)
                .orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found: " + userId, HttpStatus.NOT_FOUND));

        QuestionSession session = questionSessionService.getOwnedSession(repoId, sessionId, userId);

        String language = resolveLanguage(repoId, repository);
        String sanitizedQuestion = sanitizeQuestion(questionText);
        String sanitizedSnippet = sanitizeSnippet(codeSnippet);
        if (sanitizedQuestion == null && sanitizedSnippet == null) {
            throw new CustomException("질문 또는 코드 스니펫 중 하나는 입력해야 합니다.", HttpStatus.BAD_REQUEST);
        }
        if (sanitizedQuestion == null) {
            sanitizedQuestion = DEFAULT_CODE_REVIEW_PROMPT;
        }
        Question question = Question.builder()
                .question(sanitizedQuestion)
                .codeSnippet(sanitizedSnippet)
                .language(language)
                .build();
        question.assignUser(user);
        question.assignRepository(repository);
        question.assignSession(session);
        question.markInProgress();
        session.markActivity();

        questionRepository.save(question);

        try {
            QuestionAiClient.AiAskResult aiResult = questionAiClient.ask(repoId, language, sanitizedQuestion, sanitizedSnippet);
            if (aiResult.success() && StringUtils.hasText(aiResult.answer())) {
                aiResponseService.saveAiResult(question, aiResult);
            } else {
                String message = StringUtils.hasText(aiResult.errorMessage())
                        ? aiResult.errorMessage()
                        : "AI 응답 생성에 실패했습니다.";
                question.markFailed(message);
            }
        } catch (Exception e) {
            String message = StringUtils.hasText(e.getMessage())
                    ? e.getMessage()
                    : "AI 요청 처리 중 오류가 발생했습니다.";
            question.markFailed(message);
            log.error("AI ask failed for repoId={} questionId={}", repoId, question.getId(), e);
        }

        return question;
    }

    public Question getById(Long repoId, Long questionId, Long userId) {
        return loadQuestion(repoId, questionId, userId);
    }

    public Page<Question> getByRepository(Long repoId, Question.Status status, Long sessionId, Pageable pageable, Long userId) {
        repositoryRepository.findAccessibleById(repoId, userId)
                .orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));

        if (sessionId != null) {
            questionSessionService.getOwnedSession(repoId, sessionId, userId);
            if (status != null) {
                return questionRepository.findByRepositoryIdAndSessionIdAndStatus(repoId, sessionId, status, pageable);
            }
            return questionRepository.findByRepositoryIdAndSessionId(repoId, sessionId, pageable);
        }

        if (status != null) {
            return questionRepository.findByRepositoryIdAndStatus(repoId, status, pageable);
        }
        return questionRepository.findByRepositoryId(repoId, pageable);
    }

    @Transactional
    public Question update(Long repoId, Long questionId, Long userId, QuestionUpdateRequest request) {
        Question question = loadQuestion(repoId, questionId, userId);
        ensureOwner(question, userId);

        boolean snippetProvided = request.getCodeSnippet() != null;
        String sanitizedSnippet = snippetProvided ? sanitizeSnippet(request.getCodeSnippet()) : null;

        boolean questionProvided = request.getQuestion() != null;
        String sanitizedQuestion = null;
        if (questionProvided) {
            sanitizedQuestion = sanitizeQuestion(request.getQuestion());
            if (sanitizedQuestion == null) {
                String snippetCandidate = snippetProvided ? sanitizedSnippet : question.getCodeSnippet();
                if (StringUtils.hasText(snippetCandidate)) {
                    sanitizedQuestion = DEFAULT_CODE_REVIEW_PROMPT;
                } else {
                    throw new CustomException("질문 또는 코드 스니펫 중 하나는 입력해야 합니다.", HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (!questionProvided && snippetProvided && !StringUtils.hasText(question.getQuestion())) {
            sanitizedQuestion = DEFAULT_CODE_REVIEW_PROMPT;
            questionProvided = true;
        }

        if (!questionProvided && !snippetProvided) {
            return question;
        }

        question.updateContents(questionProvided ? sanitizedQuestion : null,
                snippetProvided ? sanitizedSnippet : null);

        return question;
    }

    @Transactional
    public void delete(Long repoId, Long questionId, Long userId) {
        Question question = loadQuestion(repoId, questionId, userId);
        ensureOwner(question, userId);
        questionRepository.delete(question);
    }

    @Transactional
    public void deleteAll(Long repoId, Long userId) {
        repositoryRepository.findAccessibleById(repoId, userId)
                .orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));

        questionRepository.deleteByRepositoryIdAndUserId(repoId, userId);
        questionSessionService.deleteAllOwnedSessions(repoId, userId);
    }

    private Question loadQuestion(Long repoId, Long questionId, Long userId) {
        repositoryRepository.findAccessibleById(repoId, userId)
                .orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));

        return questionRepository.findByIdAndRepositoryId(questionId, repoId)
                .orElseThrow(() -> new CustomException("Question not found: " + questionId, HttpStatus.NOT_FOUND));
    }

    private void ensureOwner(Question question, Long userId) {
        if (question.getUser() == null || !question.getUser().getId().equals(userId)) {
            throw new CustomException("User is not the owner of question: " + question.getId(), HttpStatus.FORBIDDEN);
        }
    }

    private String resolveLanguage(Long repoId, Repository repository) {
        String language = codeConventionRepository.findTopByRepositoryIdOrderByIdDesc(repoId)
                .map(convention -> StringUtils.trimWhitespace(convention.getLanguage()))
                .filter(StringUtils::hasText)
                .orElseGet(() -> StringUtils.hasText(repository.getLanguage()) ? repository.getLanguage() : null);

        if (!StringUtils.hasText(language)) {
            throw new CustomException("Repository language is not configured: " + repoId, HttpStatus.BAD_REQUEST);
        }

        return language;
    }

    private String sanitizeQuestion(String questionText) {
        return StringUtils.hasText(questionText) ? StringUtils.trimWhitespace(questionText) : null;
    }

    private String sanitizeSnippet(String codeSnippet) {
        return StringUtils.hasText(codeSnippet) ? codeSnippet : null;
    }
}
