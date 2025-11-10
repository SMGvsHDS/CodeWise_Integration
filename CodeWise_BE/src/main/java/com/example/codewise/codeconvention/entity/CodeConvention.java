package com.example.codewise.codeconvention.entity;

import com.example.codewise.repository.entity.Repository;
import com.example.codewise.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "code_conventions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class CodeConvention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 컨벤션 ID

    @Column(nullable = false, length = 100)
    private String title; // 컨벤션 제목

    @Lob
    @Column(nullable = false)
    private String content; // 컨벤션 내용

    @Column(nullable = false, length = 50)
    private String language; // 사용 언어 (Java, Python 등)

    // RAG 추가되면 주석 풀기
//    @Column(name = "vector_id", length = 64)
//    private String vectorId; // Vector DB 내 문서 ID

    // 🔹 연관관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_id", nullable = false)
    private Repository repository;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    public void updateFields(String title, String content, String language) {
        if (title != null) {
            this.title = title;
        }
        if (content != null) {
            this.content = content;
        }
        if (language != null) {
            this.language = language;
        }
    }
}
