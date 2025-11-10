package com.example.codewise.auth.github;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class GitHubRepositoryData {
    Long id;
    String name;
    String fullName;
    String description;
    String defaultBranch;
    boolean isPrivate;
    String language;
}
