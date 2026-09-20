package com.dementai.clinical.controller;

import com.dementai.clinical.model.Assessment;
import com.dementai.clinical.model.User;
import com.dementai.clinical.repository.AssessmentRepository;
import com.dementai.clinical.repository.UserRepository;
import com.dementai.clinical.service.MLService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final MLService mlService;

    public AssessmentController(AssessmentRepository assessmentRepository, UserRepository userRepository, MLService mlService) {
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
        this.mlService = mlService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAssessments(@RequestParam(value = "userId", required = false) String userId) {
        Map<String, Object> response = new HashMap<>();

        if (userId == null || userId.trim().isEmpty()) {
            response.put("ok", false);
            response.put("message", "userId parameter is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        List<Assessment> history = assessmentRepository.findByUserId(userId);
        response.put("ok", true);
        response.put("assessments", history);
        response.put("history", history);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/evaluate-speech")
    public ResponseEntity<Map<String, Object>> evaluateSpeech(@RequestBody Map<String, String> request) {
        String type = request.getOrDefault("type", "picture-recall");
        String transcriptText = request.getOrDefault("transcriptText", "");

        Map<String, Object> result;
        if ("picture-recall".equalsIgnoreCase(type)) {
            result = mlService.evaluatePictureRecall(transcriptText);
        } else {
            result = mlService.evaluateStructuredSpeech(transcriptText);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("ok", true);
        response.put("result", result != null ? result : new HashMap<>());
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/submit", ""})
    public ResponseEntity<Map<String, Object>> submitAssessment(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        String userId = (String) request.get("userId");
        String type = (String) request.get("type");
        int durationSeconds = request.get("durationSeconds") instanceof Number ? ((Number) request.get("durationSeconds")).intValue() : 60;
        String transcriptText = (String) request.getOrDefault("transcriptText", "");

        int score = 75;
        String riskTier = "Monitor";

        if (request.get("score") instanceof Number) {
            score = ((Number) request.get("score")).intValue();
        }
        if (request.get("riskTier") instanceof String) {
            riskTier = (String) request.get("riskTier");
        }

        String assessmentId = "asm-" + UUID.randomUUID().toString().substring(0, 8);
        String todayDate = new SimpleDateFormat("MMM d, yyyy").format(new Date());

        Assessment assessment = new Assessment(assessmentId, userId, type, todayDate, score, riskTier, durationSeconds, transcriptText);
        Assessment savedAssessment = assessmentRepository.save(assessment);

        Optional<User> userOpt = userRepository.findById(userId);
        User updatedUser = null;

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            int currentTotal = user.getTotalAssessments() != null ? user.getTotalAssessments() : 0;
            user.setTotalAssessments(currentTotal + 1);
            user.setLastAssessmentDate(todayDate);
            user.setRiskTier(riskTier);
            updatedUser = userRepository.save(user);
        }

        response.put("ok", true);
        response.put("assessment", savedAssessment);
        if (updatedUser != null) {
            response.put("user", updatedUser);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
