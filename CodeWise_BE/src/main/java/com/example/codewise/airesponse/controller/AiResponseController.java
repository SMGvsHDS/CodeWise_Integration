package com.example.codewise.airesponse.controller;

import com.example.codewise.airesponse.dto.AiResponseResponse;
import com.example.codewise.airesponse.entity.AiResponse;
import com.example.codewise.airesponse.service.AiResponseService;
import com.example.codewise.common.response.ApiResponse;
import com.example.codewise.common.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/repos/{repoId}/questions/{questionId}/ai-response")
@Validated
@RequiredArgsConstructor
/**
 * AI 응답(AiResponse) 관련 API 컨트롤러.
 */
public class AiResponseController {

    private final AiResponseService aiResponseService;

    @GetMapping
    public ResponseEntity<ApiResponse<AiResponseResponse>> getResponse(@PathVariable Long repoId,
                                                                       @PathVariable Long questionId) {
        Long userId = SecurityUtil.getCurrentUserId();
        AiResponse response = aiResponseService.getForQuestion(repoId, questionId, userId);
        return ResponseEntity.ok(ApiResponse.success("AI response fetched", AiResponseResponse.from(response)));
    }
}
