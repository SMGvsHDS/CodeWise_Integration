package com.example.codewise.repository.dto;

import com.example.codewise.repository.entity.Repository;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RepositoryResponseDto {
    private Long id;
    private Long githubRepoId;
    private String name;
    private String fullName;
    private String description;
    private String defaultBranch;
    private String visibility;
    private String language;

    public static RepositoryResponseDto fromEntity(Repository repository) {
        return RepositoryResponseDto.builder()
                .id(repository.getId())
                .githubRepoId(repository.getGithubRepoId())
                .name(repository.getName())
                .fullName(repository.getFullName())
                .description(repository.getDescription())
                .defaultBranch(repository.getDefaultBranch())
                .visibility(repository.getVisibility().getValue())
                .language(repository.getLanguage())
                .build();
    }
}
