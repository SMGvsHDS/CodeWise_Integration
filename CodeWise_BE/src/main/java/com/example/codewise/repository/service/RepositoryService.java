package com.example.codewise.repository.service;

import com.example.codewise.common.exception.CustomException;
import com.example.codewise.common.security.SecurityUtil;
import com.example.codewise.organization.repository.OrganizationRepository;
import com.example.codewise.repository.entity.Repository;
import com.example.codewise.repository.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RepositoryService {

    private final RepositoryRepository repositoryRepository;
    private final OrganizationRepository organizationRepository;

    /**
     * 🔹 특정 조직(orgId)에 속한 모든 레포 조회
     * - 이미 CustomOAuth2UserService 에서 DB에 동기화되어 있음
     * - 단순히 DB에서 조회만 수행
     */
    public List<Repository> getRepositoriesByOrganization(Long orgId) {
        Long userId = SecurityUtil.getCurrentUserId();
        validateOrganizationAccess(orgId, userId);
        return repositoryRepository.findAllByOrganizationIdAndUserId(orgId, userId);
    }

    /**
     * 🔹 수동 동기화(/orgs/{orgId}/repos/sync)
     * - 깃허브와의 재동기화는 CustomOAuth2UserService에서 처리
     * - 이 메서드는 단순히 DB에 반영된 최신 데이터를 반환
     */
    public List<Repository> syncRepositories(Long orgId) {
        return getRepositoriesByOrganization(orgId);
    }

    /**
     * 🔹 조직 ID 검증 (조직이 존재하는지 확인)
     * - 예외 방지를 위해 별도 메서드로 분리
     */
    private void validateOrganizationAccess(Long orgId, Long userId) {
        boolean hasAccess = organizationRepository.existsByIdAndMembersUserId(orgId, userId);
        if (!hasAccess) {
            throw new CustomException("Organization not accessible: " + orgId, HttpStatus.FORBIDDEN);
        }
    }
}
