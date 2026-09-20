package com.dementai.clinical.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "").toLowerCase();
        Map<String, Object> response = new HashMap<>();

        String reply;
        if (message.contains("animal") || message.contains("naming")) {
            reply = "The Animal Naming test measures verbal fluency and semantic memory processing. Speak clearly and name as many unique animals as you can within 60 seconds.";
        } else if (message.contains("picture") || message.contains("recall")) {
            reply = "The Picture Recall test evaluates visual memory retention. Inspect the scene closely, then describe all objects and interactions you remember.";
        } else if (message.contains("report") || message.contains("doctor") || message.contains("pdf")) {
            reply = "PDF Clinical Reports summarize patient assessment histories, average scores, and risk classifications. Click 'Download PDF' to generate a formal document.";
        } else {
            reply = "I am the DementAI Clinical Assistant. I can help guide you through cognitive assessments, explain risk score trends, or help generate medical reports.";
        }

        response.put("ok", true);
        response.put("reply", reply);
        return ResponseEntity.ok(response);
    }
}
