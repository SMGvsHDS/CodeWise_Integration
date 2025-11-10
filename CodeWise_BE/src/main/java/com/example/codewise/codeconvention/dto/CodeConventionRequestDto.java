package com.example.codewise.codeconvention.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeConventionRequestDto {
    private Long repo_id;
    private String title;
    private String language;
    private String content;
}
