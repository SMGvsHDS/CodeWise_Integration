package com.example.codewise.user.dto;

import com.example.codewise.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserProfileResponseDto {
    private final Long id;
    private final Long githubId;
    private final String login;
    private final String name;
    private final String email;
    private final String role;
    private final String avatarUrl;
    private final LocalDateTime lastLoginAt;

    public static UserProfileResponseDto fromEntity(User user) {
        return UserProfileResponseDto.builder()
                .id(user.getId())
                .githubId(user.getGithubId())
                .login(user.getLogin())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
