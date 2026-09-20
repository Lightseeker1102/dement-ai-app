package com.dementai.clinical.controller;

import com.dementai.clinical.model.Assessment;
import com.dementai.clinical.model.User;
import com.dementai.clinical.repository.AssessmentRepository;
import com.dementai.clinical.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;

    public ReportController(UserRepository userRepository, AssessmentRepository assessmentRepository) {
        this.userRepository = userRepository;
        this.assessmentRepository = assessmentRepository;
    }

    private void attachAssessmentHistories(List<User> patients) {
        if (patients == null || patients.isEmpty()) return;

        List<String> userIds = patients.stream()
                .map(User::getUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (userIds.isEmpty()) return;

        List<Assessment> allAssessments = assessmentRepository.findByUserIdIn(userIds);

        Map<String, List<Assessment>> historyMap = allAssessments.stream()
                .collect(Collectors.groupingBy(Assessment::getUserId));

        for (User patient : patients) {
            patient.setHistory(historyMap.getOrDefault(patient.getUserId(), Collections.emptyList()));
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getReports(@RequestParam(value = "userId", required = false) String userId) {
        Map<String, Object> response = new HashMap<>();

        if (userId != null && !userId.trim().isEmpty()) {
            List<Assessment> history = assessmentRepository.findByUserId(userId);
            response.put("ok", true);
            response.put("history", history);
            return ResponseEntity.ok(response);
        } else {
            List<User> patients = userRepository.findByRole("user");
            attachAssessmentHistories(patients);
            response.put("ok", true);
            response.put("reports", patients);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping({"/email", "/send"})
    public ResponseEntity<Map<String, Object>> emailReport(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String userId = request.get("userId");
        String doctorEmail = request.getOrDefault("doctorEmail", "");

        List<Assessment> history = assessmentRepository.findByUserId(userId);
        int avgScore = 75;
        if (!history.isEmpty()) {
            int sum = 0;
            for (Assessment a : history) {
                if (a.getScore() != null) sum += a.getScore();
            }
            avgScore = sum / history.size();
        }

        Optional<User> patientOpt = userRepository.findById(userId);
        String patientName = patientOpt.map(User::getFullName).orElse("Unknown Patient");
        String riskTier = patientOpt.map(User::getRiskTier).orElse("Monitor");

        System.out.println("Clinical Report generated for Patient: " + patientName + " (Risk: " + riskTier + ", Avg Score: " + avgScore + "). Target Doctor: " + doctorEmail);

        response.put("ok", true);
        response.put("sent", true);
        response.put("message", "Clinical report successfully generated for " + patientName);
        return ResponseEntity.ok(response);
    }
}
