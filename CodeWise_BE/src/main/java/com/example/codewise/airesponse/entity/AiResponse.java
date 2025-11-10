package com.example.codewise.airesponse.entity;

import com.example.codewise.common.entity.BaseEntity;
import com.example.codewise.question.entity.Question;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 *  AiResponse table entity
 *  AI 응답 테이블
 */
@Getter
@Entity
@Table(name = "ai_responses")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AiResponse extends BaseEntity {

    /** 기본 키 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** AI 제공자(예: upstage, openai 등) */
    @Column(name = "provider", length = 50)
    private String provider;

    /** 사용된 모델 ID */
    @Column(name = "model", length = 100)
    private String model;

    /** 프롬프트 토큰 수 */
    @Column(name = "prompt_tokens")
    private Long promptTokens;

    /** 응답 토큰 수 */
    @Column(name = "completion_tokens")
    private Long completionTokens;

    /** 전체 토큰 수 */
    @Column(name = "total_tokens")
    private Long totalTokens;

    /** 응답 생성 소요 시간(ms) */
    @Column(name = "latency_ms")
    private Long latencyMs;

    /** AI 답변 */
    @Lob
    @Column(name = "answer", columnDefinition = "LONGTEXT", nullable = false)
    private String answer;

    /** 관련된 컨벤션 ID 목록 */
    @Lob
    @Column(name = "matched_convent")
    private String matchedConvent;

    /** 에러 메시지(실패 시) */
    @Column(name = "error_message")
    private String errorMessage;

    /**
     *
     * Question과 1:1 매핑
     *
     */
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false, unique = true)
    private Question question;

    @Builder
    private AiResponse(String provider,
                       String model,
                       Long promptTokens,
                       Long completionTokens,
                       Long totalTokens,
                       Long latencyMs,
                       String answer,
                       String matchedConvent,
                       String errorMessage) {
        this.provider = provider;
        this.model = model;
        this.promptTokens = promptTokens;
        this.completionTokens = completionTokens;
        this.totalTokens = totalTokens;
        this.latencyMs = latencyMs;
        this.answer = answer;
        this.matchedConvent = matchedConvent;
        this.errorMessage = errorMessage;
    }

    public void assignQuestion(Question question) {
        this.question = question;
        if (question != null && question.getAiResponse() != this) {
            question.attachAiResponse(this);
        }
    }
}
