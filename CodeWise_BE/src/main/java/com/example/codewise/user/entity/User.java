package com.example.codewise.user.entity;

import com.example.codewise.common.entity.BaseEntity;
import com.example.codewise.organization.entity.OrganizationMember;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id; // 내부 사용자 ID (PK)

    @Column(name = "github_id", unique = true, nullable = false)
    private Long githubId; // 깃허브 고유 ID

    @Column(length = 100, nullable = false)
    private String login; // GitHub username

    @Column(length = 100)
    private String name; // 이름

    @Column(length = 100)
    private String email; // 이메일

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role; // 권한 (admin, user)

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl; // 프로필 이미지 URL

    @Column(name = "access_token", length = 255)
    private String accessToken; // GitHub OAuth 토큰

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt; // 마지막 로그인 시각

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrganizationMember> memberships = new ArrayList<>();

    public void refreshProfile(String login, String name, String email, String avatarUrl) {
        this.login = login;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    public void updateAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void updateLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public void addMembership(OrganizationMember membership) {
        if (!this.memberships.contains(membership)) {
            this.memberships.add(membership);
        }
    }

    // 권한 Enum 정의
    public enum Role {
        ADMIN, USER
    }

    @Builder
    private User(Long githubId,
                 String login,
                 String name,
                 String email,
                 Role role,
                 String avatarUrl,
                 String accessToken,
                 LocalDateTime lastLoginAt) {
        this.githubId = githubId;
        this.login = login;
        this.name = name;
        this.email = email;
        this.role = (role != null) ? role : Role.USER; // 기본값 USER
        this.avatarUrl = avatarUrl;
        this.accessToken = accessToken;
        this.lastLoginAt = lastLoginAt;
    }
}


