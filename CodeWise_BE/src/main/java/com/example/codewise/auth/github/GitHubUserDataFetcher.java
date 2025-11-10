package com.example.codewise.auth.github;

import com.example.codewise.common.githubapi.GitHubApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GitHubUserDataFetcher {

    private final GitHubApiClient gitHubApiClient;

    public GitHubUserProfile fetch(String accessToken, Map<String, Object> oauthAttributes) {
        Long githubId = getRequiredNumeric(oauthAttributes, "id");
        String login = (String) oauthAttributes.get("login");
        String name = (String) oauthAttributes.get("name");
        String avatarUrl = (String) oauthAttributes.get("avatar_url");

        String email = extractPrimaryEmail(accessToken);
        List<GitHubOrganizationData> organizations = fetchOrganizations(accessToken);
        List<GitHubRepositoryData> personalRepos = fetchPersonalRepositories(accessToken);

        return GitHubUserProfile.builder()
                .id(githubId)
                .login(login)
                .name(name)
                .email(email)
                .avatarUrl(avatarUrl)
                .organizations(organizations)
                .personalRepositories(personalRepos)
                .build();
    }

    private String extractPrimaryEmail(String accessToken) {
        List<Map<String, Object>> emails = Optional.ofNullable(gitHubApiClient.getUserEmails(accessToken))
                .orElse(Collections.emptyList());

        return emails.stream()
                .filter(email -> Boolean.TRUE.equals(email.get("primary")))
                .map(email -> (String) email.get("email"))
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    private List<GitHubOrganizationData> fetchOrganizations(String accessToken) {
        List<Map<String, Object>> orgs = Optional.ofNullable(gitHubApiClient.getUserOrgs(accessToken))
                .orElse(Collections.emptyList());

        return orgs.stream()
                .map(orgMap -> {
                    Long orgId = getRequiredNumeric(orgMap, "id");
                    String orgLogin = (String) orgMap.get("login");
                    String avatarUrl = (String) orgMap.get("avatar_url");
                    List<GitHubRepositoryData> repositories = fetchOrgRepositories(orgLogin, accessToken);

                    return GitHubOrganizationData.builder()
                            .id(orgId)
                            .login(orgLogin)
                            .avatarUrl(avatarUrl)
                            .repositories(repositories)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<GitHubRepositoryData> fetchOrgRepositories(String orgLogin, String accessToken) {
        List<Map<String, Object>> repoMaps = Optional.ofNullable(gitHubApiClient.getOrgRepos(orgLogin, accessToken))
                .orElse(Collections.emptyList());
        return toRepositoryData(repoMaps);
    }

    private List<GitHubRepositoryData> fetchPersonalRepositories(String accessToken) {
        List<Map<String, Object>> repoMaps = Optional.ofNullable(gitHubApiClient.getUserRepos(accessToken))
                .orElse(Collections.emptyList());
        return toRepositoryData(repoMaps);
    }

    private List<GitHubRepositoryData> toRepositoryData(List<Map<String, Object>> repoMaps) {
        return repoMaps.stream()
                .map(repoMap -> GitHubRepositoryData.builder()
                        .id(getRequiredNumeric(repoMap, "id"))
                        .name((String) repoMap.get("name"))
                        .fullName((String) repoMap.get("full_name"))
                        .description((String) repoMap.get("description"))
                        .defaultBranch((String) repoMap.get("default_branch"))
                        .isPrivate(Boolean.TRUE.equals(repoMap.get("private")))
                        .language((String) repoMap.get("language"))
                        .build())
                .collect(Collectors.toList());
    }

    private Long getRequiredNumeric(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        if (!(value instanceof Number number)) {
            throw new IllegalStateException("Missing numeric attribute '%s' in GitHub response".formatted(key));
        }
        return number.longValue();
    }
}
