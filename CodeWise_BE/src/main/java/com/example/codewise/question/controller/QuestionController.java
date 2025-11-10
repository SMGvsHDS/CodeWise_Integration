package com.example.codewise.question.controller;

import com.example.codewise.common.response.ApiResponse;
import com.example.codewise.common.security.SecurityUtil;
import com.example.codewise.question.dto.QuestionCreateRequest;
import com.example.codewise.question.dto.QuestionResponse;
import com.example.codewise.question.dto.QuestionUpdateRequest;
import com.example.codewise.question.entity.Question;
import com.example.codewise.question.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/repos/{repoId}/questions")
@Validated
@RequiredArgsConstructor
/**
 * 질문(Question) 관련 API 컨트롤러.
 */
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(@PathVariable Long repoId,
                                                                        @Valid @RequestBody QuestionCreateRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        Question saved = questionService.create(repoId, userId, req.getSessionId(), req.getQuestion(), req.getCodeSnippet());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Question created", QuestionResponse.from(saved)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> listQuestions(@PathVariable Long repoId,
                                                                             @RequestParam(value = "status", required = false) Question.Status status,
                                                                             @RequestParam(value = "sessionId", required = false) Long sessionId,
                                                                             @PageableDefault(size = 20) Pageable pageable) {
        Long userId = SecurityUtil.getCurrentUserId();
        Page<QuestionResponse> page = questionService.getByRepository(repoId, status, sessionId, pageable, userId)
                .map(QuestionResponse::from);
        return ResponseEntity.ok(ApiResponse.success("Questions fetched", page));
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestion(@PathVariable Long repoId,
                                                                     @PathVariable Long questionId) {
        Long userId = SecurityUtil.getCurrentUserId();
        Question question = questionService.getById(repoId, questionId, userId);
        return ResponseEntity.ok(ApiResponse.success("Question fetched", QuestionResponse.from(question)));
    }

    @PatchMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(@PathVariable Long repoId,
                                                                        @PathVariable Long questionId,
                                                                        @Valid @RequestBody QuestionUpdateRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
        Question updated = questionService.update(repoId, questionId, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Question updated", QuestionResponse.from(updated)));
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long repoId,
                                                            @PathVariable Long questionId) {
        Long userId = SecurityUtil.getCurrentUserId();
        questionService.delete(repoId, questionId, userId);
        return ResponseEntity.ok(ApiResponse.success("Question deleted", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAllQuestions(@PathVariable Long repoId) {
        Long userId = SecurityUtil.getCurrentUserId();
        questionService.deleteAll(repoId, userId);
        return ResponseEntity.ok(ApiResponse.success("All questions deleted", null));
    }
}
