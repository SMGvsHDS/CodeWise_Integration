package com.example.codewise.question.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 질문 수정 요청 DTO.
 */
@Getter
@Setter
public class QuestionUpdateRequest {

    private String question;

    private String codeSnippet;

    public QuestionUpdateRequest() {
    }
}
