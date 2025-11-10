package com.example.codewise.question.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

/**
 * 질문 생성 요청 DTO.
 *
 */
@Getter
@Setter
public class QuestionCreateRequest {

    private String question;

    private String codeSnippet;

    @NotNull
    private Long sessionId;

    public QuestionCreateRequest() {
    }

    @AssertTrue(message = "question 또는 codeSnippet 중 하나는 반드시 입력해야 합니다.")
    public boolean isContentProvided() {
        return StringUtils.hasText(question) || StringUtils.hasText(codeSnippet);
    }
}
