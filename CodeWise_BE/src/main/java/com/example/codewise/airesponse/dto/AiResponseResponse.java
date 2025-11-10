package com.example.codewise.airesponse.dto;

import com.example.codewise.airesponse.entity.AiResponse;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * AI 응답 조회 응답 DTO.
 *
 * 엔티티를 API 응답 형태로 변환하여 전달합니다.
 */
@Getter
@Setter
public class AiResponseResponse {
    private Long id;
    private Long questionId;
    private String provider;
    private String model;
    private Long promptTokens;
    private Long completionTokens;
    private Long totalTokens;
    private Long latencyMs;
    private String answer;
    private String matchedConvent;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AiResponseResponse() {
    }

    private AiResponseResponse(Long id,
                               Long questionId,
                               String provider,
                               String model,
                               Long promptTokens,
                               Long completionTokens,
                               Long totalTokens,
                               Long latencyMs,
                               String answer,
                               String matchedConvent,
                               String errorMessage,
                               LocalDateTime createdAt,
                               LocalDateTime updatedAt) {
        this.id = id;
        this.questionId = questionId;
        this.provider = provider;
        this.model = model;
        this.promptTokens = promptTokens;
        this.completionTokens = completionTokens;
        this.totalTokens = totalTokens;
        this.latencyMs = latencyMs;
        this.answer = answer;
        this.matchedConvent = matchedConvent;
        this.errorMessage = errorMessage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static AiResponseResponse from(AiResponse a) {
        if (a == null) return null;
        Long questionId = a.getQuestion() != null ? a.getQuestion().getId() : null;
        return new AiResponseResponse(
                a.getId(),
                questionId,
                a.getProvider(),
                a.getModel(),
                a.getPromptTokens(),
                a.getCompletionTokens(),
                a.getTotalTokens(),
                a.getLatencyMs(),
                a.getAnswer(),
                a.getMatchedConvent(),
                a.getErrorMessage(),
                a.getCreatedAt(),
                a.getUpdatedAt()
        );
    }
}
