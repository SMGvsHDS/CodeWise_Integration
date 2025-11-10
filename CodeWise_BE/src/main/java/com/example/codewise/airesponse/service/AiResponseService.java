package com.example.codewise.airesponse.service;

import com.example.codewise.airesponse.entity.AiResponse;
import com.example.codewise.airesponse.repository.AiResponseRepository;
import com.example.codewise.common.exception.CustomException;
import com.example.codewise.question.entity.Question;
import com.example.codewise.question.repository.QuestionRepository;
import com.example.codewise.question.service.client.QuestionAiClient;
import com.example.codewise.repository.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiResponseService {

    private final AiResponseRepository aiResponseRepository;
    private final QuestionRepository questionRepository;
    private final RepositoryRepository repositoryRepository;

    public AiResponse getForQuestion(Long repoId, Long questionId, Long userId) {
        Question question = loadQuestion(repoId, questionId, userId);
        AiResponse response = question.getAiResponse();
        if (response == null) {
            throw new CustomException("AI response not found for question: " + questionId, HttpStatus.NOT_FOUND);
        }
        return response;
    }

    @Transactional
    public AiResponse saveAiResult(Question question, QuestionAiClient.AiAskResult aiResult) {
        if (question.getAiResponse() != null) {
            throw new CustomException("AI response already exists for question: " + question.getId(), HttpStatus.CONFLICT);
        }

        AiResponse ai = AiResponse.builder()
                .provider(aiResult.provider())
                .model(aiResult.model())
                .promptTokens(aiResult.promptTokens())
                .completionTokens(aiResult.completionTokens())
                .totalTokens(aiResult.totalTokens())
                .latencyMs(aiResult.latencyMs())
                .answer(aiResult.answer())
                .matchedConvent(aiResult.matchedConvention())
                .errorMessage(aiResult.errorMessage())
                .build();

        question.attachAiResponse(ai);
        ai.assignQuestion(question);
        question.markAnswered();

        return aiResponseRepository.save(ai);
    }

    private Question loadQuestion(Long repoId, Long questionId, Long userId) {
        repositoryRepository.findAccessibleById(repoId, userId)
                .orElseThrow(() -> new CustomException("Repository not accessible: " + repoId, HttpStatus.FORBIDDEN));

        return questionRepository.findByIdAndRepositoryId(questionId, repoId)
                .orElseThrow(() -> new CustomException("Question not found: " + questionId, HttpStatus.NOT_FOUND));
    }
}
