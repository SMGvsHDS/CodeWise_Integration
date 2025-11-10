package com.example.codewise.question.controller;

import com.example.codewise.common.response.ApiResponse;
import com.example.codewise.common.security.SecurityUtil;
import com.example.codewise.question.dto.QuestionSessionCreateRequest;
import com.example.codewise.question.dto.QuestionSessionResponse;
import com.example.codewise.question.entity.QuestionSession;
import com.example.codewise.question.service.QuestionSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/repos/{repoId}/sessions")
@RequiredArgsConstructor
public class QuestionSessionController {

    private final QuestionSessionService questionSessionService;

    @PostMapping
    public ResponseEntity<ApiResponse<QuestionSessionResponse>> createSession(@PathVariable Long repoId,
                                                                              @Valid @RequestBody QuestionSessionCreateRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
        QuestionSession created = questionSessionService.create(repoId, userId, request.getTitle());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Session created", QuestionSessionResponse.from(created)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestionSessionResponse>>> listSessions(@PathVariable Long repoId) {
        Long userId = SecurityUtil.getCurrentUserId();
        List<QuestionSessionResponse> sessions = questionSessionService.list(repoId, userId)
                .stream()
                .map(QuestionSessionResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Sessions fetched", sessions));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(@PathVariable Long repoId,
                                                           @PathVariable Long sessionId) {
        Long userId = SecurityUtil.getCurrentUserId();
        questionSessionService.delete(repoId, sessionId, userId);
        return ResponseEntity.ok(ApiResponse.success("Session deleted", null));
    }
}
