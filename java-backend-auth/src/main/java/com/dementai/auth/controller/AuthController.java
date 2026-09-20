package com.dementai.auth.controller;

import com.dementai.auth.model.Hospital;
import com.dementai.auth.model.User;
import com.dementai.auth.repository.HospitalRepository;
import com.dementai.auth.repository.UserRepository;
import com.dementai.auth.util.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final JWTUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, HospitalRepository hospitalRepository, JWTUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String username = request.getOrDefault("username", "").trim();
        String password = request.getOrDefault("password", "");

        Map<String, Object> response = new HashMap<>();

        Optional<User> existingUserOpt = userRepository.findByUsernameOrEmail(username);
        if (existingUserOpt.isEmpty()) {
            response.put("ok", false);
            response.put("errorType", "USER_NOT_FOUND");
            response.put("message", "Username or email '" + username + "' is not registered.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        User existingUser = existingUserOpt.get();
        boolean passwordMatches = passwordEncoder.matches(password, existingUser.getPassword());

        // Automatic legacy password migration: if plain text password matches, upgrade to BCrypt hash
        if (!passwordMatches && password.equals(existingUser.getPassword())) {
            passwordMatches = true;
            existingUser.setPassword(passwordEncoder.encode(password));
            userRepository.save(existingUser);
        }

        if (!passwordMatches) {
            response.put("ok", false);
            response.put("errorType", "PASSWORD_MISMATCH");
            response.put("message", "Incorrect password for '" + username + "'. Please check your password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = jwtUtil.generateToken(existingUser.getUserId(), existingUser.getUsername(), existingUser.getRole());

        response.put("ok", true);
        response.put("token", token);
        response.put("user", existingUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> request) {
        String username = ((String) request.getOrDefault("username", "")).trim();
        String email = ((String) request.getOrDefault("email", "")).trim();
        String password = (String) request.getOrDefault("password", "");
        String fullName = ((String) request.getOrDefault("fullName", "")).trim();
        String phone = ((String) request.getOrDefault("phone", "")).trim();
        int age = request.get("age") instanceof Number ? ((Number) request.get("age")).intValue() : 0;
        String role = ((String) request.getOrDefault("role", "user")).trim().toLowerCase();
        if (!Arrays.asList("user", "doctor", "admin").contains(role)) {
            role = "user";
        }
        String securityQuestion = (String) request.getOrDefault("securityQuestion", "What is the name of your first pet or dog?");
        String securityAnswer = ((String) request.getOrDefault("securityAnswer", "")).trim();

        // Clinical / Doctor Specific fields
        String secretCode = ((String) request.getOrDefault("secretCode", "")).trim();
        String licenseNumber = ((String) request.getOrDefault("licenseNumber", "")).trim();
        String medicalSpecialization = ((String) request.getOrDefault("medicalSpecialization", "General Cognitive Medicine")).trim();
        String doctorCode = ((String) request.getOrDefault("doctorCode", "")).trim();

        Map<String, Object> response = new HashMap<>();

        if (userRepository.findByUsername(username).isPresent()) {
            response.put("ok", false);
            response.put("errorType", "DUPLICATE_USERNAME");
            response.put("message", "Username '" + username + "' is already taken. Please choose another.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (userRepository.findByEmail(email).isPresent()) {
            response.put("ok", false);
            response.put("errorType", "DUPLICATE_EMAIL");
            response.put("message", "Email '" + email + "' is already associated with an account.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Hospital matchedHospital = null;
        if ("doctor".equalsIgnoreCase(role)) {
            if (secretCode.isEmpty()) {
                response.put("ok", false);
                response.put("errorType", "MISSING_SECRET_CODE");
                response.put("message", "Doctor registration requires a valid Secret Hospital Access Code provided by your hospital admin.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            Optional<Hospital> hospOpt = hospitalRepository.findBySecretCode(secretCode);
            if (hospOpt.isEmpty() || !"ACTIVE".equalsIgnoreCase(hospOpt.get().getStatus())) {
                response.put("ok", false);
                response.put("errorType", "INVALID_HOSPITAL_CODE");
                response.put("message", "Invalid or inactive Hospital Access Code '" + secretCode + "'. Please contact your Hospital Administrator.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            matchedHospital = hospOpt.get();
        }

        User newUser = new User();
        newUser.setUserId((role.equals("doctor") ? "doc-" : "user-") + UUID.randomUUID().toString().substring(0, 8));
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        newUser.setPhone(phone);
        newUser.setAge(age);
        newUser.setRole(role);
        newUser.setRiskTier("Monitor");
        newUser.setLastAssessmentDate(new SimpleDateFormat("MMM d, yyyy").format(new Date()));
        newUser.setTotalAssessments(0);
        newUser.setSecurityQuestion(securityQuestion);
        newUser.setSecurityAnswer(securityAnswer);

        if (matchedHospital != null) {
            newUser.setHospitalId(matchedHospital.getHospitalId());
            newUser.setHospitalName(matchedHospital.getHospitalName());
            newUser.setLicenseNumber(licenseNumber.isEmpty() ? "MD-" + UUID.randomUUID().toString().substring(0, 6) : licenseNumber);
            newUser.setMedicalSpecialization(medicalSpecialization);
        }

        // If regular user linked a doctor during registration
        if (!doctorCode.isEmpty()) {
            Optional<User> docOpt = userRepository.findByUsernameOrEmail(doctorCode);
            if (docOpt.isPresent() && "doctor".equalsIgnoreCase(docOpt.get().getRole())) {
                newUser.setDoctorName(docOpt.get().getFullName());
                newUser.setDoctorEmail(docOpt.get().getEmail());
            }
        }

        User savedUser = userRepository.save(newUser);
        String token = jwtUtil.generateToken(savedUser.getUserId(), savedUser.getUsername(), savedUser.getRole());

        response.put("ok", true);
        response.put("token", token);
        response.put("user", savedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/security-question")
    public ResponseEntity<Map<String, Object>> getSecurityQuestion(@RequestBody Map<String, String> request) {
        String username = request.getOrDefault("username", "").trim();
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByUsernameOrEmail(username);
        if (userOpt.isPresent() && userOpt.get().getSecurityQuestion() != null && !userOpt.get().getSecurityQuestion().isEmpty()) {
            response.put("ok", true);
            response.put("question", userOpt.get().getSecurityQuestion());
            return ResponseEntity.ok(response);
        } else {
            response.put("ok", false);
            response.put("message", "No security question found for account '" + username + "'.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        String username = request.getOrDefault("username", "").trim();
        String answer = request.getOrDefault("securityAnswer", "").trim();
        String newPassword = request.getOrDefault("newPassword", "");

        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByUsernameOrEmail(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getSecurityAnswer() != null && user.getSecurityAnswer().equalsIgnoreCase(answer)) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                response.put("ok", true);
                response.put("message", "Password reset successfully. You can now sign in with your new password.");
                return ResponseEntity.ok(response);
            }
        }

        response.put("ok", false);
        response.put("message", "Incorrect security answer for '" + username + "'.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
