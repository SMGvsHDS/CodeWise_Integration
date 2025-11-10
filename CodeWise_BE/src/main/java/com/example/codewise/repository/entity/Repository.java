package com.example.codewise.repository.entity;

import com.example.codewise.common.entity.BaseEntity;
import com.example.codewise.organization.entity.Organization;
import com.example.codewise.user.entity.User;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "repositories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Repository extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 내부 PK

    @Column(name = "github_repo_id", nullable = false, unique = true)
    private Long githubRepoId; // GitHub 레포 고유 ID

    @Column(nullable = false, length = 100)
    private String name; // 레포 이름

    @Column(name = "full_name", length = 150)
    private String fullName; // 전체 경로 (org/repo)

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "default_branch", length = 50)
    private String defaultBranch; // 기본 브랜치 (예: main, master)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Visibility visibility; // 공개 여부

    @Column(name = "language", length = 50)
    private String language; // 주요 언어

    // 연관관계 매핑 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id")
    private Organization organization; // 소속 조직

    // 개인 레포와 User 연결
    @ManyToMany
    @JoinTable(
            name = "user_repositories",
            joinColumns = @JoinColumn(name = "repository_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> users = new HashSet<>();

    // === Enum 정의 ===
    @Getter
    @RequiredArgsConstructor
    public enum Visibility {
        public_("public"),
        private_("private");

        private final String value;

        @JsonValue
        public String getValue() {
            return value;
        }
    }

    public void updateMetadata(String name,
                               String fullName,
                               String description,
                               String defaultBranch,
                               boolean isPrivate,
                               String language) {
        this.name = name;
        this.fullName = fullName;
        this.description = description;
        this.defaultBranch = defaultBranch;
        this.visibility = isPrivate ? Visibility.private_ : Visibility.public_;
        this.language = language;
    }

    public void assignOrganization(Organization organization) {
        this.organization = organization;
    }

    public void attachUser(User user) {
        if (user != null) {
            this.users.add(user);
        }
    }
}
