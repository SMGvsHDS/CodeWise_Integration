package com.example.codewise.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//@Schema(description = "공통 API 응답 포맷")
public class ApiResponse<T> {

    //@Schema(description = "요청 처리 성공 여부", example = "true")
    private boolean success;

    //@Schema(description = "응답 메시지", example = "요청이 성공적으로 처리되었습니다.")
    private String message;

    //@Schema(description = "응답 본문 데이터")
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "success", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> failure(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
