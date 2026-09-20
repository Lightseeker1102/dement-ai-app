package com.dementai.clinical.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MLService {

    private final RestTemplate restTemplate;
    private final String mlServiceUrl;

    public MLService(@Value("${ml.service.url:http://localhost:8000}") String mlServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.mlServiceUrl = mlServiceUrl;
    }

    public Map<String, Object> evaluatePictureRecall(String transcriptText) {
        return callMLEndpoint("/evaluate/picture-recall", transcriptText, 60.0);
    }

    public Map<String, Object> evaluatePictureRecall(String transcriptText, double durationSeconds) {
        return callMLEndpoint("/evaluate/picture-recall", transcriptText, durationSeconds);
    }

    public Map<String, Object> evaluateStructuredSpeech(String transcriptText) {
        return callMLEndpoint("/evaluate/structured-speech", transcriptText, 60.0);
    }

    public Map<String, Object> evaluateStructuredSpeech(String transcriptText, double durationSeconds) {
        return callMLEndpoint("/evaluate/structured-speech", transcriptText, durationSeconds);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callMLEndpoint(String endpoint, String transcriptText, double durationSeconds) {
        String cleanText = transcriptText != null ? transcriptText.trim() : "";
        double duration = durationSeconds > 0 ? durationSeconds : 60.0;

        try {
            String targetUrl = mlServiceUrl + endpoint;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("transcript_text", cleanText);
            body.put("duration_seconds", duration);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(targetUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> respBody = response.getBody();
                if (Boolean.TRUE.equals(respBody.get("ok")) && respBody.get("result") instanceof Map) {
                    Map<String, Object> res = (Map<String, Object>) respBody.get("result");
                    res.put("isFallback", false);
                    return res;
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: ML Service call failed (" + endpoint + "): " + e.getMessage());
        }

        // Dynamic heuristic fallback calculation when Python ML Service is unreachable
        String[] words = cleanText.toLowerCase().replaceAll("[^a-z0-9\\s]", "").split("\\s+");
        int wordCount = cleanText.isEmpty() ? 0 : words.length;

        int score;
        if (wordCount == 0) {
            score = 15;
        } else if (wordCount >= 35) {
            score = 85;
        } else if (wordCount >= 20) {
            score = 72;
        } else if (wordCount >= 10) {
            score = 55;
        } else {
            score = 35;
        }

        String riskTier;
        if (score >= 78) riskTier = "Low";
        else if (score >= 63) riskTier = "Monitor";
        else if (score >= 48) riskTier = "High";
        else riskTier = "Critical";

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("assessment_type", endpoint.contains("picture") ? "picture-recall" : "structured-speech");
        fallback.put("score", score);
        fallback.put("risk_tier", riskTier);
        fallback.put("transcript_text", cleanText);
        fallback.put("duration_seconds", duration);
        fallback.put("isFallback", true);
        fallback.put("engine", "Java-Heuristic-Fallback (ML Service Offline)");
        fallback.put("warning", "Python ML Engine was unreachable. Calculated fallback score dynamically based on transcript lexical density.");
        return fallback;
    }
}
