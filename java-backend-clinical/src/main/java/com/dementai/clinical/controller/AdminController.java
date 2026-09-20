package com.dementai.clinical.controller;

import com.dementai.clinical.model.Assessment;
import com.dementai.clinical.model.User;
import com.dementai.clinical.repository.AssessmentRepository;
import com.dementai.clinical.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;

    public AdminController(UserRepository userRepository, AssessmentRepository assessmentRepository) {
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

    @GetMapping("/patients")
    public ResponseEntity<Map<String, Object>> getPatients(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size) {
        Map<String, Object> response = new HashMap<>();

        List<User> patients;
        long totalElements;

        if (page != null && size != null && page >= 0 && size > 0) {
            Page<User> patientPage = userRepository.findByRole("user", PageRequest.of(page, size));
            patients = patientPage.getContent();
            totalElements = patientPage.getTotalElements();
            response.put("page", page);
            response.put("size", size);
            response.put("totalPages", patientPage.getTotalPages());
        } else {
            patients = userRepository.findByRole("user");
            totalElements = patients.size();
        }

        attachAssessmentHistories(patients);

        response.put("ok", true);
        response.put("patients", patients);
        response.put("total", totalElements);
        return ResponseEntity.ok(response);
    }

    /**
     * Sync endpoint — since both Auth and Clinical services now share the same MySQL database,
     * this endpoint ONLY updates supplemental clinical fields (doctor, riskTier) for existing users.
     * It will NOT create new users (that is Auth service's responsibility) and will NOT
     * overwrite password or authentication fields.
     */
    @PostMapping("/patient/sync")
    public ResponseEntity<Map<String, Object>> syncPatient(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        String userId = (String) request.get("userId");
        if (userId == null || userId.isEmpty()) {
            response.put("ok", false);
            response.put("message", "Missing userId");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            // User doesn't exist in shared DB yet — safe to skip, Auth service will have created it
            response.put("ok", true);
            response.put("message", "User not found in shared DB — skipping sync");
            return ResponseEntity.ok(response);
        }

        User u = userOpt.get();
        // Only update supplemental clinical fields, never touch password/auth fields
        if (request.containsKey("riskTier") && request.get("riskTier") != null)
            u.setRiskTier((String) request.get("riskTier"));
        if (request.containsKey("doctorName") && request.get("doctorName") != null)
            u.setDoctorName((String) request.get("doctorName"));
        if (request.containsKey("doctorEmail") && request.get("doctorEmail") != null)
            u.setDoctorEmail((String) request.get("doctorEmail"));
        if (request.get("age") instanceof Number)
            u.setAge(((Number) request.get("age")).intValue());

        userRepository.save(u);
        response.put("ok", true);
        response.put("patient", u);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/doctor")
    public ResponseEntity<Map<String, Object>> updateDoctorInfo(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String userId = request.get("userId");
        String doctorName = request.get("doctorName");
        String doctorEmail = request.get("doctorEmail");

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            u.setDoctorName(doctorName);
            u.setDoctorEmail(doctorEmail);
            userRepository.save(u);

            response.put("ok", true);
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/patient/update")
    public ResponseEntity<Map<String, Object>> updatePatientDetails(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        String userId = (String) request.get("userId");
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isPresent()) {
            User u = userOpt.get();
            if (request.containsKey("fullName")) u.setFullName((String) request.get("fullName"));
            if (request.containsKey("email")) u.setEmail((String) request.get("email"));
            if (request.containsKey("phone")) u.setPhone((String) request.get("phone"));
            if (request.get("age") instanceof Number) u.setAge(((Number) request.get("age")).intValue());
            if (request.containsKey("riskTier")) u.setRiskTier((String) request.get("riskTier"));
            if (request.containsKey("doctorName")) u.setDoctorName((String) request.get("doctorName"));
            if (request.containsKey("doctorEmail")) u.setDoctorEmail((String) request.get("doctorEmail"));

            userRepository.save(u);
            response.put("ok", true);
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @DeleteMapping("/patient")
    public ResponseEntity<Map<String, Object>> deletePatient(@RequestParam("userId") String userId) {
        Map<String, Object> response = new HashMap<>();

        if (userId != null && !userId.isEmpty() && userRepository.existsById(userId)) {
            assessmentRepository.deleteByUserId(userId);
            userRepository.deleteById(userId);
            response.put("ok", true);
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        response.put("message", "User not found or missing userId");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @PostMapping("/patients/bulk-delete")
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, Object>> bulkDeletePatients(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        String type = (String) request.getOrDefault("type", "all");
        int count = 0;

        if ("all".equalsIgnoreCase(type)) {
            assessmentRepository.deleteAllAssessments();
            count = userRepository.deleteAllPatients();
        } else if ("riskTier".equalsIgnoreCase(type)) {
            List<String> riskTiers = (List<String>) request.get("riskTiers");
            if (riskTiers != null && !riskTiers.isEmpty()) {
                assessmentRepository.deleteByRiskTiers(riskTiers);
                count = userRepository.deleteByRiskTierIn(riskTiers);
            }
        } else if ("selected".equalsIgnoreCase(type)) {
            List<String> userIds = (List<String>) request.get("userIds");
            if (userIds != null && !userIds.isEmpty()) {
                assessmentRepository.deleteByUserIdIn(userIds);
                count = userRepository.deleteByUserIdIn(userIds);
            }
        }

        response.put("ok", true);
        response.put("deletedCount", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors")
    public ResponseEntity<Map<String, Object>> getDoctors() {
        Map<String, Object> response = new HashMap<>();

        List<User> doctors = userRepository.findByRole("doctor");
        List<User> allPatients = userRepository.findByRole("user");

        List<Map<String, Object>> doctorList = new ArrayList<>();
        for (User doc : doctors) {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", doc.getUserId());
            map.put("username", doc.getUsername());
            map.put("fullName", doc.getFullName());
            map.put("email", doc.getEmail());
            map.put("phone", doc.getPhone());
            map.put("hospitalId", doc.getHospitalId());
            map.put("hospitalName", doc.getHospitalName());
            map.put("licenseNumber", doc.getLicenseNumber());
            map.put("medicalSpecialization", doc.getMedicalSpecialization());

            // Count assigned patients
            long assignedCount = allPatients.stream().filter(p ->
                (doc.getEmail() != null && doc.getEmail().equalsIgnoreCase(p.getDoctorEmail())) ||
                (doc.getFullName() != null && doc.getFullName().equalsIgnoreCase(p.getDoctorName()))
            ).count();

            map.put("assignedPatientsCount", assignedCount);
            doctorList.add(map);
        }

        response.put("ok", true);
        response.put("doctors", doctorList);
        response.put("total", doctorList.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/doctor/update")
    public ResponseEntity<Map<String, Object>> updateDoctorDetailsByAdmin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String doctorId = request.get("userId");

        Optional<User> docOpt = userRepository.findById(doctorId);
        if (docOpt.isPresent()) {
            User d = docOpt.get();
            if (request.containsKey("fullName")) d.setFullName(request.get("fullName"));
            if (request.containsKey("email")) d.setEmail(request.get("email"));
            if (request.containsKey("phone")) d.setPhone(request.get("phone"));
            if (request.containsKey("hospitalId")) d.setHospitalId(request.get("hospitalId"));
            if (request.containsKey("hospitalName")) d.setHospitalName(request.get("hospitalName"));
            if (request.containsKey("licenseNumber")) d.setLicenseNumber(request.get("licenseNumber"));
            if (request.containsKey("medicalSpecialization")) d.setMedicalSpecialization(request.get("medicalSpecialization"));

            userRepository.save(d);
            response.put("ok", true);
            response.put("doctor", d);
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        response.put("message", "Doctor record not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @DeleteMapping("/doctor")
    public ResponseEntity<Map<String, Object>> deleteDoctorByAdmin(@RequestParam("userId") String doctorId) {
        Map<String, Object> response = new HashMap<>();

        if (doctorId != null && !doctorId.isEmpty() && userRepository.existsById(doctorId)) {
            userRepository.deleteById(doctorId);
            response.put("ok", true);
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        response.put("message", "Doctor not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
