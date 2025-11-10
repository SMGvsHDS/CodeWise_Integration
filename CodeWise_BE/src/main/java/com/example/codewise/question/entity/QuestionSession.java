package com.example.codewise.question.entity;

import com.example.codewise.common.entity.BaseEntity;
import com.example.codewise.repository.entity.Repository;
import com.example.codewise.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

/**
 * Question chat session entity.
 *
 * Represents a chat-like conversation grouping multiple questions
 * for a specific repository and user.
 */
@Getter
@Entity
@Table(name = "question_sessions")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuestionSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", length = 120, nullable = false)
    private String title;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Builder
    private QuestionSession(Repository repository, User user, String title) {
        this.repository = repository;
        this.user = user;
        setTitle(title);
        this.lastMessageAt = LocalDateTime.now();
    }

    public void assignRepository(Repository repository) {
        this.repository = repository;
    }

    public void assignUser(User user) {
        this.user = user;
    }

    public void setTitle(String title) {
        String trimmed = StringUtils.hasText(title) ? title.trim() : null;
        this.title = trimmed != null ? trimmed : "New chat";
    }

    public void markActivity() {
        this.lastMessageAt = LocalDateTime.now();
    }
}
