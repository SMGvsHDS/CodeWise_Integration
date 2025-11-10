package com.example.codewise.auth.github;

import lombok.Builder;
import lombok.Singular;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class GitHubUserProfile {
    Long id;
    String login;
    String name;
    String email;
    String avatarUrl;

    @Singular
    List<GitHubOrganizationData> organizations;

    @Singular
    List<GitHubRepositoryData> personalRepositories;
}
