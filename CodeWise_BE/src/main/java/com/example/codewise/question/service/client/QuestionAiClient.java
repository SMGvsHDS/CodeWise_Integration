package com.example.codewise.question.service.client;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class QuestionAiClient {

    private final WebClient fastApiWebClient;

    @Value("${external.fastapi.paths.ai.ask:/ai/ask}")
    private String askPath;

    @Value("${external.fastapi.timeout-seconds:30}")
    private long timeoutSeconds;

    public AiAskResult ask(Long repoId, String language, String question, String codeSnippet) {
        try {
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("repo_id", repoId);
            requestBody.put("language", language);
            requestBody.put("question", question);
            if (codeSnippet != null) {
                requestBody.put("code_snippet", codeSnippet);
            }

            JsonNode response = fastApiWebClient.post()
                    .uri(askPath)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .block();

            if (response == null) {
                throw new AiClientException("FastAPI 응답이 비어 있습니다.");
            }

            boolean success = response.path("success").asBoolean(false);
            String answer = extractText(response, "answer");
            String errorMessage = extractError(response);
            JsonNode usageNode = response.has("usage") ? response.get("usage") : response.get("token_usage");
            Long promptTokens = extractLong(usageNode, "prompt_tokens");
            Long completionTokens = extractLong(usageNode, "completion_tokens");
            Long totalTokens = extractLong(usageNode, "total_tokens");
            if (totalTokens == null && promptTokens != null && completionTokens != null) {
                totalTokens = promptTokens + completionTokens;
            }

            String provider = extractText(response, "provider");
            String model = extractText(response, "model");
            Long latencyMs = extractLong(response, "latency_ms");
            String matchedConvention = extractMatchedConvention(response);

            return new AiAskResult(
                    success,
                    answer,
                    errorMessage,
                    provider,
                    model,
                    promptTokens,
                    completionTokens,
                    totalTokens,
                    latencyMs,
                    matchedConvention
            );
        } catch (WebClientResponseException e) {
            log.error("FastAPI responded with status={} body={}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new AiClientException("FastAPI 호출에 실패했습니다: " + e.getStatusText(), e);
        } catch (Exception e) {
            throw new AiClientException("FastAPI 호출 중 오류가 발생했습니다.", e);
        }
    }

    private String extractText(JsonNode node, String fieldName) {
        if (node == null || node.get(fieldName) == null || node.get(fieldName).isNull()) {
            return null;
        }
        String text = node.get(fieldName).asText(null);
        return (text != null && text.isBlank()) ? null : text;
    }

    private Long extractLong(JsonNode node, String fieldName) {
        if (node == null) {
            return null;
        }
        JsonNode value = node.get(fieldName);
        if (value == null || value.isNull() || !value.isNumber()) {
            return null;
        }
        return value.longValue();
    }

    private String extractError(JsonNode node) {
        String message = extractText(node, "message");
        if (message != null) {
            return message;
        }
        message = extractText(node, "error");
        if (message != null) {
            return message;
        }
        JsonNode errors = node.get("errors");
        if (errors != null && errors.isArray() && errors.size() > 0) {
            return errors.get(0).asText();
        }
        return null;
    }

    private String extractMatchedConvention(JsonNode node) {
        JsonNode matched = node.get("matched_convent");
        if (matched == null) {
            matched = node.get("matched_conventions");
        }
        if (matched == null || matched.isNull()) {
            return null;
        }
        if (matched.isTextual()) {
            return matched.asText();
        }
        return matched.toString();
    }

    public record AiAskResult(
            boolean success,
            String answer,
            String errorMessage,
            String provider,
            String model,
            Long promptTokens,
            Long completionTokens,
            Long totalTokens,
            Long latencyMs,
            String matchedConvention
    ) {
    }

    public static class AiClientException extends RuntimeException {
        public AiClientException(String message) {
            super(message);
        }

        public AiClientException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
