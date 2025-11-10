package com.example.codewise.question.dto;

import com.example.codewise.question.entity.QuestionSession;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class QuestionSessionResponse {

    private final Long id;
    private final String title;
    private final Long repositoryId;
    private final Long userId;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final LocalDateTime lastMessageAt;

    private QuestionSessionResponse(Long id,
                                    String title,
                                    Long repositoryId,
                                    Long userId,
                                    LocalDateTime createdAt,
                                    LocalDateTime updatedAt,
                                    LocalDateTime lastMessageAt) {
        this.id = id;
        this.title = title;
        this.repositoryId = repositoryId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastMessageAt = lastMessageAt;
    }

    public static QuestionSessionResponse from(QuestionSession session) {
        if (session == null) {
            return null;
        }
        Long repoId = session.getRepository() != null ? session.getRepository().getId() : null;
        Long ownerId = session.getUser() != null ? session.getUser().getId() : null;
        return new QuestionSessionResponse(
                session.getId(),
                session.getTitle(),
                repoId,
                ownerId,
                session.getCreatedAt(),
                session.getUpdatedAt(),
                session.getLastMessageAt()
        );
    }
}
