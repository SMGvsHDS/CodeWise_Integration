package com.example.codewise.organization.entity;

import com.example.codewise.common.entity.BaseEntity;
import com.example.codewise.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organization_members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class OrganizationMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Organization N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role; // ORG 내 권한 (예: MEMBER, ADMIN)

    public enum Role {
        MEMBER, ADMIN
    }

    public boolean hasUserId(Long userId) {
        return userId != null && this.user != null && userId.equals(this.user.getId());
    }
}
