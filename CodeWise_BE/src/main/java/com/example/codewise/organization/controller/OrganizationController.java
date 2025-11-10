package com.example.codewise.organization.controller;

import com.example.codewise.common.response.ApiResponse;
import com.example.codewise.organization.dto.OrganizationResponseDto;
import com.example.codewise.organization.entity.Organization;
import com.example.codewise.organization.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orgs")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    /**
     * 🔹 로그인한 사용자의 조직 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrganizationResponseDto>>> getOrganizations() {
        List<OrganizationResponseDto> response = organizationService.getOrganizations()
                .stream()
                .map(OrganizationResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Organizations fetched", response));
    }

    /**
     * 🔹 수동 동기화 (DB에 이미 반영된 최신 조직 목록 반환)
     * - 실제 깃허브 API 호출은 CustomOAuth2UserService에서 처리
     */
    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<List<OrganizationResponseDto>>> syncOrganizations() {
        List<OrganizationResponseDto> response = organizationService.syncOrganizations()
                .stream()
                .map(OrganizationResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Organizations synchronized", response));
    }
}
