package com.example.codewise.codeconvention.service;

import com.example.codewise.codeconvention.entity.CodeConvention;
import com.example.codewise.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class CodeConventionNotifier {

    private final WebClient fastApiWebClient;

    @Value("${external.fastapi.paths.conventions:/conventions}")
    private String conventionsPath;

    public void notifyCreated(CodeConvention convention) {
        var payload = new ConventionPayload(
                convention.getId(),
                convention.getRepository().getId(),
                convention.getTitle(),
                convention.getLanguage(),
                convention.getContent()
        );

        executeRequest(
                () -> fastApiWebClient.post()
                        .uri(conventionsPath)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(payload)
                        .retrieve()
                        .toBodilessEntity(),
                "컨벤션 생성"
        );
    }

    public void notifyUpdated(CodeConvention convention) {
        var payload = new ConventionPayload(
                convention.getId(),
                convention.getRepository().getId(),
                convention.getTitle(),
                convention.getLanguage(),
                convention.getContent()
        );

        executeRequest(
                () -> fastApiWebClient.patch()
                        .uri("%s/%d".formatted(conventionsPath, convention.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(payload)
                        .retrieve()
                        .toBodilessEntity(),
                "컨벤션 수정"
        );
    }

    public void notifyDeleted(Long conventionId, Long repoId) {
        executeRequest(
                () -> fastApiWebClient.delete()
                        .uri(uriBuilder -> uriBuilder
                                .path("%s/%d".formatted(conventionsPath, conventionId))
                                .queryParam("repo_id", repoId)
                                .build()
                        )
                        .retrieve()
                        .toBodilessEntity(),
                "컨벤션 삭제"
        );
    }

    private record ConventionPayload(Long convention_id, Long repo_id, String title, String language, String content) {
    }

    private void executeRequest(Supplier<Mono<ResponseEntity<Void>>> requestSupplier, String action) {
        try {
            requestSupplier.get()
                    .timeout(Duration.ofSeconds(10))
                    .onErrorResume(throwable -> {
                        log.warn("Failed to notify FastAPI server ({})", action, throwable);
                        return Mono.error(throwable);
                    })
                    .block();
            log.info("FastAPI 서버 {} 알림 완료", action);
        } catch (WebClientResponseException e) {
            log.error("FastAPI server responded with error status={} body={} (action={})", e.getStatusCode(), e.getResponseBodyAsString(), action, e);
            throw new CustomException("FastAPI 서버 응답이 실패했습니다.", HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            log.error("FastAPI 서버 알림 중 예기치 못한 오류 (action={})", action, e);
            throw new CustomException("FastAPI 서버로의 알림이 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
