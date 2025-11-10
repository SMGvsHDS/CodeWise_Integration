package com.example.codewise.organization.service;

import com.example.codewise.common.exception.CustomException;
import com.example.codewise.common.security.SecurityUtil;
import com.example.codewise.organization.entity.Organization;
import com.example.codewise.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    // 현재 로그인 사용자의 조직 목록 조회
    public List<Organization> getOrganizations() {
        Long userId = SecurityUtil.getCurrentUserId();
        return organizationRepository.findDistinctByMembersUserIdOrderByOrgNameAsc(userId);
    }

    /**
     * 🔹 수동 동기화(/orgs/sync) 버튼 눌렀을 때
     * - DB 조회 전용으로 남겨두되,
     *   실제 깃허브와의 동기화는 CustomOAuth2UserService에서 처리함
     * - 여기서는 DB에 반영된 최신 데이터만 반환
     */
    public List<Organization> syncOrganizations() {
        // 깃허브 API 호출은 없음 (CustomOAuth2UserService가 처리)
        return getOrganizations();
    }

    public Organization getAccessibleOrganization(Long orgId) {
        Long userId = SecurityUtil.getCurrentUserId();
        Optional<Organization> organization = organizationRepository.findByIdAndMembersUserId(orgId, userId);
        return organization.orElseThrow(() ->
                new CustomException("Organization not accessible: " + orgId, HttpStatus.FORBIDDEN));
    }

    public boolean hasAccessToOrganization(Long orgId, Long userId) {
        return organizationRepository.existsByIdAndMembersUserId(orgId, userId);
    }

//    // GitHub API로부터 조직 목록을 가져와 DB 동기화
//    @Transactional
//    public List<Organization> syncOrganizations(String accessToken) {
//        // 1️⃣ 깃허브에서 조직 리스트 가져오기
//        List<Organization> githubOrgs = gitHubClient.fetchUserOrganizations(accessToken);
//
//        // 2️⃣ 기존 DB에 존재 여부 체크 → 없으면 추가
//        for (Organization org : githubOrgs) {
//            organizationRepository.findByGithubOrgId(org.getGithubOrgId())
//                    .ifPresentOrElse(
//                            existing -> {}, // 이미 있으면 스킵
//                            () -> organizationRepository.save(org)
//                    );
//        }
//
//        // 3️⃣ 최신 목록 반환
//        return organizationRepository.findAll();
//    }
}
