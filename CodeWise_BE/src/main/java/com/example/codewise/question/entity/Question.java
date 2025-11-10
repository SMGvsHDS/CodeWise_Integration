package com.example.codewise.question.entity;

import com.example.codewise.airesponse.entity.AiResponse;
import com.example.codewise.common.entity.BaseEntity;
import com.example.codewise.organization.entity.Organization;
import com.example.codewise.repository.entity.Repository;
import com.example.codewise.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * question table entity
 * 사용자가 코드 스니펫과 질문을 남긴 기록을 저장.
 */
@Getter
@Entity
@Table(name = "questions")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Question extends BaseEntity {

    /** 기본 키 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 질문 본문(장문 텍스트) */
    @Lob
    @Column(name = "question", nullable = false)
   private String question;

    /** 질문과 함께 전달된 코드 스니펫 */
    @Lob
    @Column(name = "code_snippet", columnDefinition = "LONGTEXT")
    private String codeSnippet;

    /** 질문 시점의 언어 */
    @Column(name = "language", length = 50)
    private String language;

    /** 질문 상태 */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private Status status;

    /** 질문 실패 사유(있는 경우) */
    @Column(name = "failure_reason")
    private String failureReason;

    /** 질문자 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 질문이 속한 조직(없을 수도 있음) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    /** 질문이 속한 저장소 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    /** 질문이 속한 채팅 세션 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private QuestionSession session;

    /** Response와 1:1 매핑  */
    @OneToOne(mappedBy = "question", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private AiResponse aiResponse;

    @Builder
    private Question(String question,
                     String codeSnippet,
                     String language) {
        this.question = question;
        this.codeSnippet = codeSnippet;
        this.language = language;
        this.status = Status.PENDING;
    }

    public void assignUser(User user) {
        this.user = user;
    }

    public void assignRepository(Repository repository) {
        this.repository = repository;
        if (repository != null) {
            this.organization = repository.getOrganization();
        }
    }

    public void assignSession(QuestionSession session) {
        this.session = session;
    }

    public void updateContents(String question, String codeSnippet) {
        if (question != null) {
            this.question = question;
        }
        if (codeSnippet != null) {
            this.codeSnippet = codeSnippet;
        }
    }

    public void attachAiResponse(AiResponse aiResponse) {
        this.aiResponse = aiResponse;
    }

    public void markInProgress() {
        this.status = Status.IN_PROGRESS;
        this.failureReason = null;
    }

    public void markAnswered() {
        this.status = Status.ANSWERED;
        this.failureReason = null;
    }

    public void markFailed(String reason) {
        this.status = Status.FAILED;
        this.failureReason = reason;
    }

    public enum Status {
        PENDING,
        IN_PROGRESS,
        ANSWERED,
        FAILED
    }
}
