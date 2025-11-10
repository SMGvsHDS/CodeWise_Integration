package com.example.codewise.codeconvention.controller;

import com.example.codewise.codeconvention.dto.CodeConventionRequestDto;
import com.example.codewise.codeconvention.dto.CodeConventionResponseDto;
import com.example.codewise.codeconvention.service.CodeConventionService;
import com.example.codewise.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CodeConventionController {

    private final CodeConventionService codeConventionService;

    /**
     * ✅ 코드 컨벤션 등록
     * - JWT 인증 사용자 전용
     * - ⚠️ 추후 '조직 관리자(OWNER, ADMIN)'만 가능하도록 권한 체크 추가 예정
     */
    @PostMapping("/repos/{repoId}/code-conventions")
    public ResponseEntity<ApiResponse<CodeConventionResponseDto>> createConvention(
            @PathVariable Long repoId,
            @RequestBody CodeConventionRequestDto request
    ) {
        request.setRepo_id(repoId);
        CodeConventionResponseDto response = codeConventionService.createConvention(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Convention created", response));
    }

    // ✅ 해당 레포의 컨벤션 목록 조회 (로그인 사용자)
    @GetMapping("/repos/{repoId}/code-conventions")
    public ResponseEntity<ApiResponse<List<CodeConventionResponseDto>>> getConventionsByRepo(@PathVariable Long repoId) {
        List<CodeConventionResponseDto> response = codeConventionService.getConventionsByRepo(repoId);
        return ResponseEntity.ok(ApiResponse.success("Conventions fetched", response));
    }

    // ✅ 컨벤션 상세 조회 (로그인 사용자)
    @GetMapping("/code-conventions/{id}")
    public ResponseEntity<ApiResponse<CodeConventionResponseDto>> getConventionDetail(@PathVariable Long id) {
        CodeConventionResponseDto response = codeConventionService.getConventionById(id);
        return ResponseEntity.ok(ApiResponse.success("Convention fetched", response));
    }

    /**
     * ✅ 컨벤션 수정
     * - ⚠️ 추후 '조직 관리자(OWNER, ADMIN)'만 수정 가능하도록 권한 체크 예정
     */
    @PatchMapping("/code-conventions/{id}")
    public ResponseEntity<ApiResponse<CodeConventionResponseDto>> updateConvention(
            @PathVariable Long id,
            @RequestBody CodeConventionRequestDto request
    ) {
        CodeConventionResponseDto response = codeConventionService.updateConvention(id, request);
        return ResponseEntity.ok(ApiResponse.success("Convention updated", response));
    }

    /**
     * ✅ 컨벤션 삭제
     * - ⚠️ 추후 '조직 관리자(OWNER, ADMIN)'만 삭제 가능하도록 권한 체크 예정
     */
    @DeleteMapping("/code-conventions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteConvention(@PathVariable Long id) {
        codeConventionService.deleteConvention(id);
        return ResponseEntity.ok(ApiResponse.success("Convention deleted", null));
    }
}
