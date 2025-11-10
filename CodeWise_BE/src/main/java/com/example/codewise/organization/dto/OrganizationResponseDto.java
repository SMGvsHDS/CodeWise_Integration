package com.example.codewise.organization.dto;

import com.example.codewise.organization.entity.Organization;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrganizationResponseDto {
    private Long id;
    private Long githubOrgId;
    private String login;
    private String name;
    private String avatarUrl;

    public static OrganizationResponseDto fromEntity(Organization organization) {
        return OrganizationResponseDto.builder()
                .id(organization.getId())
                .githubOrgId(organization.getGithubOrgId())
                .login(organization.getOrgName())
                .name(organization.getOrgName())
                .avatarUrl(organization.getAvatarUrl())
                .build();
    }
}
