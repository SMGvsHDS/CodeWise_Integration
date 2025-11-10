package com.example.codewise.codeconvention.service;

import com.example.codewise.codeconvention.dto.CodeConventionRequestDto;
import com.example.codewise.codeconvention.dto.CodeConventionResponseDto;
import com.example.codewise.codeconvention.entity.CodeConvention;
import com.example.codewise.codeconvention.repository.CodeConventionRepository;
import com.example.codewise.common.exception.CustomException;
import com.example.codewise.common.security.SecurityUtil;
import com.example.codewise.repository.entity.Repository;
import com.example.codewise.repository.repository.RepositoryRepository;
import com.example.codewise.user.entity.User;
import com.example.codewise.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CodeConventionService {

    private final CodeConventionRepository codeConventionRepository;
    private final RepositoryRepository repositoryRepository;
    private final UserRepository userRepository;
    private final CodeConventionNotifier codeConventionNotifier;

    // ✅ 코드 컨벤션 등록
    @Transactional
    public CodeConventionResponseDto createConvention(CodeConventionRequestDto request) {
        Long userId = SecurityUtil.getCurrentUserId();
        User creator = getCurrentUser(userId);
        Repository repo = getAccessibleRepository(request.getRepo_id(), userId);

        CodeConvention convention = CodeConvention.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .language(request.getLanguage())
                .repository(repo)
                .createdBy(creator)
                .build();

        CodeConvention saved = codeConventionRepository.save(convention);

        codeConventionNotifier.notifyCreated(saved);

        return toResponseDto(saved);
    }

    // ✅ 특정 레포의 컨벤션 목록 조회
    public List<CodeConventionResponseDto> getConventionsByRepo(Long repoId) {
        Long userId = SecurityUtil.getCurrentUserId();
        ensureRepositoryAccess(repoId, userId);

        return codeConventionRepository.findAllByRepositoryIdAndUserId(repoId, userId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    // ✅ 컨벤션 단건 상세 조회
    public CodeConventionResponseDto getConventionById(Long id) {
        Long userId = SecurityUtil.getCurrentUserId();
        CodeConvention c = codeConventionRepository.findAccessibleById(id, userId)
                .orElseThrow(() -> new CustomException("Convention not accessible: " + id, HttpStatus.FORBIDDEN));

        return toResponseDto(c);
    }

    // ✅ 컨벤션 내용 수정
    @Transactional
    public CodeConventionResponseDto updateConvention(Long id, CodeConventionRequestDto request) {
        Long userId = SecurityUtil.getCurrentUserId();
        CodeConvention convention = codeConventionRepository.findAccessibleById(id, userId)
                .orElseThrow(() -> new CustomException("Convention not accessible: " + id, HttpStatus.FORBIDDEN));

        // 업데이트할 필드만 반영
        convention.updateFields(request.getTitle(), request.getContent(), request.getLanguage());

        CodeConvention updated = codeConventionRepository.save(convention);

        codeConventionNotifier.notifyUpdated(updated);

        return toResponseDto(updated);
    }

    // ✅ 컨벤션 삭제
    @Transactional
    public void deleteConvention(Long id) {
        Long userId = SecurityUtil.getCurrentUserId();
        CodeConvention convention = codeConventionRepository.findAccessibleById(id, userId)
                .orElseThrow(() -> new CustomException("Convention not accessible: " + id, HttpStatus.FORBIDDEN));
        codeConventionRepository.delete(convention);
        codeConventionNotifier.notifyDeleted(convention.getId(), convention.getRepository().getId());
    }

    private void ensureRepositoryAccess(Long repoId, Long userId) {
        boolean accessible = repositoryRepository.findAccessibleById(repoId, userId).isPresent();
        if (!accessible) {
            throw new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN);
        }
    }

    private Repository getAccessibleRepository(Long repoId, Long userId) {
        Optional<Repository> repository = repositoryRepository.findAccessibleById(repoId, userId);
        return repository.orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));
    }

    private User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found: " + userId, HttpStatus.UNAUTHORIZED));
    }

    private CodeConventionResponseDto toResponseDto(CodeConvention convention) {
        return CodeConventionResponseDto.builder()
                .id(convention.getId())
                .repo_id(convention.getRepository().getId())
                .title(convention.getTitle())
                .language(convention.getLanguage())
                .content(convention.getContent())
                .created_by(convention.getCreatedBy().getId())
                .created_by_login(convention.getCreatedBy().getLogin())
                .created_at(LocalDateTime.now())
                .build();
    }
}
