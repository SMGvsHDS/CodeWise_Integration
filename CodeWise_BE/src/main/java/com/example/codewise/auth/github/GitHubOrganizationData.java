package com.example.codewise.auth.github;

import lombok.Builder;
import lombok.Singular;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class GitHubOrganizationData {
    Long id;
    String login;
    String avatarUrl;
    @Singular
    List<GitHubRepositoryData> repositories;
}
