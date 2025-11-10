package com.example.codewise.question.repository;

import com.example.codewise.question.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Question Entity JPA Repository
 */
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Page<Question> findByRepositoryId(Long repositoryId, Pageable pageable);

    Page<Question> findByRepositoryIdAndStatus(Long repositoryId, Question.Status status, Pageable pageable);

    Page<Question> findByRepositoryIdAndSessionId(Long repositoryId, Long sessionId, Pageable pageable);

    Page<Question> findByRepositoryIdAndSessionIdAndStatus(Long repositoryId, Long sessionId, Question.Status status, Pageable pageable);

    Optional<Question> findByIdAndRepositoryId(Long questionId, Long repositoryId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from Question q where q.session.id = :sessionId and q.user.id = :userId")
    int deleteBySessionIdAndUserId(@Param("sessionId") Long sessionId, @Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from Question q where q.repository.id = :repositoryId and q.user.id = :userId")
    int deleteByRepositoryIdAndUserId(@Param("repositoryId") Long repositoryId, @Param("userId") Long userId);
}
