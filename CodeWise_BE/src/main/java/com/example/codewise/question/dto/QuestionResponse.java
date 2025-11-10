package com.example.codewise.question.dto;

import com.example.codewise.airesponse.dto.AiResponseResponse;
import com.example.codewise.question.entity.Question;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 질문 응답 DTO.
 *
 * 엔티티를 API 응답 형태로 변환하여 전달합니다.
 */
@Getter
@Setter
public class QuestionResponse {
    private Long id;
    private String question;
    private String codeSnippet;
    private String language;
    private Question.Status status;
    private String failureReason;
    private Long userId;
    private String userLogin;
    private Long organizationId;
    private String organizationName;
    private Long repositoryId;
    private String repositoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AiResponseResponse aiResponse;
    private Long sessionId;
    private String sessionTitle;

    public QuestionResponse() {
    }

    private QuestionResponse(Long id,
                             String question,
                             String codeSnippet,
                             String language,
                             Question.Status status,
                             String failureReason,
                             Long userId,
                             String userLogin,
                             Long organizationId,
                             String organizationName,
                             Long repositoryId,
                             String repositoryName,
                             LocalDateTime createdAt,
                             LocalDateTime updatedAt,
                             AiResponseResponse aiResponse,
                             Long sessionId,
                             String sessionTitle) {
        this.id = id;
        this.question = question;
        this.codeSnippet = codeSnippet;
        this.language = language;
        this.status = status;
        this.failureReason = failureReason;
        this.userId = userId;
        this.userLogin = userLogin;
        this.organizationId = organizationId;
        this.organizationName = organizationName;
        this.repositoryId = repositoryId;
        this.repositoryName = repositoryName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.aiResponse = aiResponse;
        this.sessionId = sessionId;
        this.sessionTitle = sessionTitle;
    }

    public static QuestionResponse from(Question q) {
        if (q == null) return null;
        Long userId = q.getUser() != null ? q.getUser().getId() : null;
        String userLogin = q.getUser() != null ? q.getUser().getLogin() : null;
        Long orgId = q.getOrganization() != null ? q.getOrganization().getId() : null;
        String orgName = q.getOrganization() != null ? q.getOrganization().getOrgName() : null;
        Long repoId = q.getRepository() != null ? q.getRepository().getId() : null;
        String repoName = q.getRepository() != null ? q.getRepository().getName() : null;
        Long sessionId = q.getSession() != null ? q.getSession().getId() : null;
        String sessionTitle = q.getSession() != null ? q.getSession().getTitle() : null;

        return new QuestionResponse(
                q.getId(),
                q.getQuestion(),
                q.getCodeSnippet(),
                q.getLanguage(),
                q.getStatus(),
                q.getFailureReason(),
                userId,
                userLogin,
                orgId,
                orgName,
                repoId,
                repoName,
                q.getCreatedAt(),
                q.getUpdatedAt(),
                AiResponseResponse.from(q.getAiResponse()),
                sessionId,
                sessionTitle
        );
    }
}
