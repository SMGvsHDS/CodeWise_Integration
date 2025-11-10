package com.example.codewise.codeconvention.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeConventionResponseDto {
    private Long id;
    private Long repo_id;
    private String title;
    private String language;
    private String content;
//    private String vector_id;
    private Long created_by;
    private String created_by_login;
    private LocalDateTime created_at;
}
