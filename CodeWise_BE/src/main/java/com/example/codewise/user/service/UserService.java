package com.example.codewise.user.service;

import com.example.codewise.common.exception.CustomException;
import com.example.codewise.common.security.SecurityUtil;
import com.example.codewise.user.dto.UserProfileResponseDto;
import com.example.codewise.user.entity.User;
import com.example.codewise.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponseDto getCurrentUserProfile() {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found: " + userId, HttpStatus.UNAUTHORIZED));
        return UserProfileResponseDto.fromEntity(user);
    }
}
