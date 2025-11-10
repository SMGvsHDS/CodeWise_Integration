package com.example.codewise.question.repository;

import com.example.codewise.question.entity.QuestionSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionSessionRepository extends JpaRepository<QuestionSession, Long> {
    List<QuestionSession> findByRepositoryIdAndUserIdOrderByLastMessageAtDesc(Long repositoryId, Long userId);

    Optional<QuestionSession> findByIdAndRepositoryIdAndUserId(Long id, Long repositoryId, Long userId);
}
