package com.example.codewise.user.controller;

import com.example.codewise.common.response.ApiResponse;
import com.example.codewise.user.dto.UserProfileResponseDto;
import com.example.codewise.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getCurrentUser() {
        UserProfileResponseDto profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success("User profile fetched", profile));
    }
}
