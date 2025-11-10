package com.example.codewise.organization.repository;

import com.example.codewise.organization.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    // 🔹 GitHub orgId로 단건 조회
    Optional<Organization> findByGithubOrgId(Long githubOrgId);

    // 🔹 org명으로 조회
    Optional<Organization> findByOrgName(String orgName);

    List<Organization> findDistinctByMembersUserIdOrderByOrgNameAsc(Long userId);

    Optional<Organization> findByIdAndMembersUserId(Long orgId, Long userId);

    boolean existsByIdAndMembersUserId(Long orgId, Long userId);

//    // 🔹 생성자 ID 기준 조회 (특정 유저가 만든 조직들)
//    @Query("SELECT o FROM Organization o WHERE o.createdBy.id = :userId")
//    List<Organization> findByCreatedById(@Param("userId") Long userId);
//
//    // 🔹 Organization + createdBy(User) 조인해서 한 번에 가져오기
//    @Query("SELECT o FROM Organization o JOIN FETCH o.createdBy WHERE o.id = :id")
//    Optional<Organization> findWithCreator(@Param("id") Long id);
}
