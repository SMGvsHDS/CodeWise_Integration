package com.example.codewise.question.service;

import com.example.codewise.common.exception.CustomException;
import com.example.codewise.question.entity.QuestionSession;
import com.example.codewise.question.repository.QuestionRepository;
import com.example.codewise.question.repository.QuestionSessionRepository;
import com.example.codewise.repository.entity.Repository;
import com.example.codewise.repository.repository.RepositoryRepository;
import com.example.codewise.user.entity.User;
import com.example.codewise.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionSessionService {

    private final QuestionSessionRepository questionSessionRepository;
    private final RepositoryRepository repositoryRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    @Transactional
    public QuestionSession create(Long repoId, Long userId, String title) {
        Repository repository = repositoryRepository.findAccessibleById(repoId, userId)
                .orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found: " + userId, HttpStatus.NOT_FOUND));

        String defaultedTitle = StringUtils.hasText(title)
                ? title.trim()
                : "Chat " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        QuestionSession session = QuestionSession.builder()
                .repository(repository)
                .user(user)
                .title(defaultedTitle)
                .build();

        return questionSessionRepository.save(session);
    }

    public List<QuestionSession> list(Long repoId, Long userId) {
        repositoryRepository.findAccessibleById(repoId, userId)
                .orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));

        return questionSessionRepository.findByRepositoryIdAndUserIdOrderByLastMessageAtDesc(repoId, userId);
    }

    public QuestionSession getOwnedSession(Long repoId, Long sessionId, Long userId) {
        return questionSessionRepository.findByIdAndRepositoryIdAndUserId(sessionId, repoId, userId)
                .orElseThrow(() -> new CustomException("Session not found: " + sessionId, HttpStatus.NOT_FOUND));
    }

    @Transactional
    public void delete(Long repoId, Long sessionId, Long userId) {
        QuestionSession session = getOwnedSession(repoId, sessionId, userId);
        questionRepository.deleteBySessionIdAndUserId(sessionId, userId);
        questionSessionRepository.delete(session);
    }

    @Transactional
    public void deleteAllOwnedSessions(Long repoId, Long userId) {
        repositoryRepository.findAccessibleById(repoId, userId)
                .orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));

        List<QuestionSession> sessions = questionSessionRepository.findByRepositoryIdAndUserIdOrderByLastMessageAtDesc(repoId, userId);
        if (!sessions.isEmpty()) {
            questionSessionRepository.deleteAllInBatch(sessions);
        }
    }
}
