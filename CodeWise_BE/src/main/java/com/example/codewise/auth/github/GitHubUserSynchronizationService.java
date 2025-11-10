package com.example.codewise.auth.github;

import com.example.codewise.organization.entity.Organization;
import com.example.codewise.organization.entity.OrganizationMember;
import com.example.codewise.organization.repository.OrganizationRepository;
import com.example.codewise.repository.entity.Repository;
import com.example.codewise.repository.repository.RepositoryRepository;
import com.example.codewise.user.entity.User;
import com.example.codewise.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GitHubUserSynchronizationService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final RepositoryRepository repositoryRepository;

    @Transactional
    public User synchronize(String accessToken, GitHubUserProfile profile) {
        User user = userRepository.findByGithubId(profile.getId())
                .map(existing -> refreshExistingUser(existing, profile, accessToken))
                .orElseGet(() -> createNewUser(profile, accessToken));

        synchronizeOrganizations(user, profile.getOrganizations());
        synchronizePersonalRepositories(user, profile.getPersonalRepositories());

        return user;
    }

    private User refreshExistingUser(User user, GitHubUserProfile profile, String accessToken) {
        user.refreshProfile(profile.getLogin(), profile.getName(), profile.getEmail(), profile.getAvatarUrl());
        user.updateAccessToken(accessToken);
        user.updateLastLoginAt(LocalDateTime.now());
        return user;
    }

    private User createNewUser(GitHubUserProfile profile, String accessToken) {
        User newUser = User.builder()
                .githubId(profile.getId())
                .login(profile.getLogin())
                .name(profile.getName())
                .email(profile.getEmail())
                .avatarUrl(profile.getAvatarUrl())
                .accessToken(accessToken)
                .lastLoginAt(LocalDateTime.now())
                .build();
        return userRepository.save(newUser);
    }

    private void synchronizeOrganizations(User user, List<GitHubOrganizationData> organizations) {
        for (GitHubOrganizationData organizationData : organizations) {
            Organization organization = organizationRepository.findByGithubOrgId(organizationData.getId())
                    .map(existing -> updateOrganization(existing, organizationData))
                    .orElseGet(() -> createOrganization(organizationData));

            registerMembershipIfAbsent(user, organization);
            synchronizeOrganizationRepositories(organization, organizationData.getRepositories());
        }
    }

    private Organization updateOrganization(Organization organization, GitHubOrganizationData data) {
        organization.updateProfile(data.getLogin(), data.getAvatarUrl());
        return organization;
    }

    private Organization createOrganization(GitHubOrganizationData data) {
        Organization organization = Organization.builder()
                .githubOrgId(data.getId())
                .orgName(data.getLogin())
                .avatarUrl(data.getAvatarUrl())
                .build();
        return organizationRepository.save(organization);
    }

    private void registerMembershipIfAbsent(User user, Organization organization) {
        boolean alreadyMember = organization.getMembers().stream()
                .anyMatch(member -> member.hasUserId(user.getId()));
        if (alreadyMember) {
            return;
        }

        OrganizationMember member = OrganizationMember.builder()
                .user(user)
                .organization(organization)
                .role(OrganizationMember.Role.MEMBER)
                .build();
        organization.addMember(member);
        user.addMembership(member);
    }

    private void synchronizeOrganizationRepositories(Organization organization, List<GitHubRepositoryData> repositories) {
        for (GitHubRepositoryData repositoryData : repositories) {
            Repository repository = repositoryRepository.findByGithubRepoId(repositoryData.getId())
                    .map(existing -> updateRepository(existing, repositoryData))
                    .orElseGet(() -> createRepository(repositoryData, organization));
            organization.addRepository(repository);
        }
    }

    private void synchronizePersonalRepositories(User user, List<GitHubRepositoryData> personalRepositories) {
        for (GitHubRepositoryData repositoryData : personalRepositories) {
            Repository repository = repositoryRepository.findByGithubRepoId(repositoryData.getId())
                    .map(existing -> updateRepository(existing, repositoryData))
                    .orElseGet(() -> createRepository(repositoryData, null));
            repository.attachUser(user);
        }
    }

    private Repository updateRepository(Repository repository, GitHubRepositoryData data) {
        repository.updateMetadata(
                data.getName(),
                data.getFullName(),
                data.getDescription(),
                data.getDefaultBranch(),
                data.isPrivate(),
                data.getLanguage()
        );
        return repository;
    }

    private Repository createRepository(GitHubRepositoryData data, Organization organization) {
        Repository repository = Repository.builder()
                .githubRepoId(data.getId())
                .name(data.getName())
                .fullName(data.getFullName())
                .description(data.getDescription())
                .defaultBranch(data.getDefaultBranch())
                .visibility(data.isPrivate() ? Repository.Visibility.private_ : Repository.Visibility.public_)
                .language(data.getLanguage())
                .organization(organization)
                .build();
        return repositoryRepository.save(repository);
    }
}
