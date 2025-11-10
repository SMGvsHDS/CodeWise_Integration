package com.example.codewise.organization.entity;

import com.example.codewise.common.entity.BaseEntity;
import com.example.codewise.repository.entity.Repository;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organizations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Organization extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 내부 식별자 (PK)

    @Column(name = "github_org_id", nullable = false, unique = true)
    private Long githubOrgId; // GitHub 조직 고유 ID

    @Column(nullable = false, length = 100)
    private String orgName; // 조직명

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl; // 조직 프로필 이미지

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrganizationMember> members = new ArrayList<>();

    // 연관관계
    // Organization(1) : Repository(N)
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Repository> repositories = new ArrayList<>();

    public void updateProfile(String orgName, String avatarUrl) {
        this.orgName = orgName;
        this.avatarUrl = avatarUrl;
    }

    public void addMember(OrganizationMember member) {
        if (!this.members.contains(member)) {
            this.members.add(member);
        }
    }

    public void addRepository(Repository repository) {
        if (!this.repositories.contains(repository)) {
            repository.assignOrganization(this);
            this.repositories.add(repository);
        }
    }
}
