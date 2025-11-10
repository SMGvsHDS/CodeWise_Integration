package com.example.codewise.codeconvention.repository;

import com.example.codewise.codeconvention.entity.CodeConvention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CodeConventionRepository extends JpaRepository<CodeConvention, Long> {

    // 특정 레포의 컨벤션 목록 조회
    @Query(
            "SELECT DISTINCT c FROM CodeConvention c " +
            "JOIN c.repository r " +
            "LEFT JOIN r.organization o " +
            "LEFT JOIN o.members m " +
            "LEFT JOIN m.user memberUser " +
            "LEFT JOIN r.users u " +
            "WHERE r.id = :repoId " +
            "AND (memberUser.id = :userId OR u.id = :userId)"
    )
    List<CodeConvention> findAllByRepositoryIdAndUserId(@Param("repoId") Long repoId, @Param("userId") Long userId);

    @Query(
            "SELECT c FROM CodeConvention c " +
            "JOIN c.repository r " +
            "LEFT JOIN r.organization o " +
            "LEFT JOIN o.members m " +
            "LEFT JOIN m.user memberUser " +
            "LEFT JOIN r.users u " +
            "WHERE c.id = :id " +
            "AND (memberUser.id = :userId OR u.id = :userId)"
    )
    Optional<CodeConvention> findAccessibleById(@Param("id") Long id, @Param("userId") Long userId);

    Optional<CodeConvention> findTopByRepositoryIdOrderByIdDesc(Long repositoryId);
}
