package com.example.codewise.question.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionSessionCreateRequest {

    @Size(max = 120)
    private String title;
}
