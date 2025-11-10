package com.example.codewise.repository.controller;

import com.example.codewise.common.response.ApiResponse;
import com.example.codewise.repository.dto.RepositoryResponseDto;
import com.example.codewise.repository.service.RepositoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orgs/{orgId}/repos")
@RequiredArgsConstructor
public class RepositoryController {

    private final RepositoryService repositoryService;

    /**
     * 🔹 특정 조직(orgId)의 모든 레포 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RepositoryResponseDto>>> getRepositories(@PathVariable Long orgId) {
        List<RepositoryResponseDto> response = repositoryService.getRepositoriesByOrganization(orgId)
                .stream()
                .map(RepositoryResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Repositories fetched", response));
    }

    /**
     * 🔹 수동 동기화 (DB에 반영된 최신 레포 목록 반환)
     * - 깃허브와의 실제 동기화는 CustomOAuth2UserService가 담당
     */
    @GetMapping("/sync")
    public ResponseEntity<ApiResponse<List<RepositoryResponseDto>>> syncRepositories(@PathVariable Long orgId) {
        List<RepositoryResponseDto> response = repositoryService.syncRepositories(orgId)
                .stream()
                .map(RepositoryResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Repositories synchronized", response));
    }
}
