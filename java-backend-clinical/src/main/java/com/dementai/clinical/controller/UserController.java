package com.dementai.clinical.controller;

import com.dementai.clinical.model.User;
import com.dementai.clinical.repository.AssessmentRepository;
import com.dementai.clinical.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;

    public UserController(UserRepository userRepository, AssessmentRepository assessmentRepository) {
        this.userRepository = userRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@RequestParam("userId") String userId) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setHistory(assessmentRepository.findByUserId(userId));
            response.put("ok", true);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        response.put("message", "User not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
