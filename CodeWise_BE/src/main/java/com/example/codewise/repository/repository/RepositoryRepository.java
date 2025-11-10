package com.example.codewise.repository.repository;

import com.example.codewise.repository.entity.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RepositoryRepository extends JpaRepository<Repository, Long> {

    // 🔹 GitHub repoId로 단건 조회
    Optional<Repository> findByGithubRepoId(Long githubRepoId);

    // 🔹 특정 조직(org_id)에 속한 모든 레포 조회
    @Query("SELECT r FROM Repository r WHERE r.organization.id = :orgId ORDER BY r.name ASC")
    List<Repository> findAllByOrganizationId(@Param("orgId") Long orgId);

    @Query(
            "SELECT DISTINCT r FROM Repository r " +
            "JOIN r.organization o " +
            "JOIN o.members m " +
            "WHERE o.id = :orgId AND m.user.id = :userId " +
            "ORDER BY r.name ASC"
    )
    List<Repository> findAllByOrganizationIdAndUserId(@Param("orgId") Long orgId, @Param("userId") Long userId);

    @Query(
            "SELECT DISTINCT r FROM Repository r " +
            "LEFT JOIN r.organization o " +
            "LEFT JOIN o.members m " +
            "LEFT JOIN m.user memberUser " +
            "LEFT JOIN r.users u " +
            "WHERE r.id = :repoId " +
            "AND (memberUser.id = :userId OR u.id = :userId)"
    )
    Optional<Repository> findAccessibleById(@Param("repoId") Long repoId, @Param("userId") Long userId);

    // 🔹 Organization + Repository 조인 즉시 로딩
    @Query("SELECT r FROM Repository r JOIN FETCH r.organization WHERE r.id = :repoId")
    Optional<Repository> findWithOrganization(@Param("repoId") Long repoId);
}
