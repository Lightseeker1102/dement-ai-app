package com.dementai.clinical.controller;

import com.dementai.clinical.model.Hospital;
import com.dementai.clinical.model.User;
import com.dementai.clinical.repository.HospitalRepository;
import com.dementai.clinical.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/hospitals")
public class HospitalController {

    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;

    public HospitalController(HospitalRepository hospitalRepository, UserRepository userRepository) {
        this.hospitalRepository = hospitalRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHospitals() {
        Map<String, Object> response = new HashMap<>();
        List<Hospital> hospitals = hospitalRepository.findAll();

        List<Map<String, Object>> resultList = hospitals.stream().map(h -> {
            Map<String, Object> map = new HashMap<>();
            map.put("hospitalId", h.getHospitalId());
            map.put("hospitalName", h.getHospitalName());
            map.put("secretCode", h.getSecretCode());
            map.put("licenseNumber", h.getLicenseNumber());
            map.put("location", h.getLocation());
            map.put("contactEmail", h.getContactEmail());
            map.put("maxDoctors", h.getMaxDoctors());
            map.put("status", h.getStatus());
            map.put("createdAt", h.getCreatedAt());

            long docCount = userRepository.countByRoleAndHospitalId("doctor", h.getHospitalId());
            long patientCount = userRepository.countByRoleAndHospitalId("user", h.getHospitalId());

            map.put("doctorCount", docCount);
            map.put("patientCount", patientCount);
            return map;
        }).collect(Collectors.toList());

        response.put("ok", true);
        response.put("hospitals", resultList);
        response.put("total", resultList.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createHospital(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        String hospitalName = ((String) request.getOrDefault("hospitalName", "")).trim();
        String secretCode = ((String) request.getOrDefault("secretCode", "")).trim();
        String licenseNumber = ((String) request.getOrDefault("licenseNumber", "")).trim();
        String location = ((String) request.getOrDefault("location", "")).trim();
        String contactEmail = ((String) request.getOrDefault("contactEmail", "")).trim();
        int maxDoctors = request.get("maxDoctors") instanceof Number ? ((Number) request.get("maxDoctors")).intValue() : 50;

        if (hospitalName.isEmpty()) {
            response.put("ok", false);
            response.put("message", "Hospital Name is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (secretCode.isEmpty()) {
            secretCode = hospitalName.replaceAll("[^A-Za-z0-9]", "").toUpperCase() + "-" + (1000 + new Random().nextInt(9000));
        }

        if (hospitalRepository.findBySecretCode(secretCode).isPresent()) {
            response.put("ok", false);
            response.put("message", "Secret Code '" + secretCode + "' is already in use. Please generate a unique code.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Hospital h = new Hospital();
        h.setHospitalId("hosp-" + UUID.randomUUID().toString().substring(0, 8));
        h.setHospitalName(hospitalName);
        h.setSecretCode(secretCode);
        h.setLicenseNumber(licenseNumber.isEmpty() ? "HOSP-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase() : licenseNumber);
        h.setLocation(location);
        h.setContactEmail(contactEmail);
        h.setMaxDoctors(maxDoctors);
        h.setStatus("ACTIVE");

        Hospital saved = hospitalRepository.save(h);
        response.put("ok", true);
        response.put("hospital", saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/regenerate-code")
    public ResponseEntity<Map<String, Object>> regenerateSecretCode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String hospitalId = request.get("hospitalId");

        Optional<Hospital> hOpt = hospitalRepository.findById(hospitalId);
        if (hOpt.isPresent()) {
            Hospital h = hOpt.get();
            String newCode = h.getHospitalName().replaceAll("[^A-Za-z0-9]", "").toUpperCase() + "-" + (1000 + new Random().nextInt(9000));
            h.setSecretCode(newCode);
            hospitalRepository.save(h);

            response.put("ok", true);
            response.put("secretCode", newCode);
            response.put("hospital", h);
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        response.put("message", "Hospital not found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteHospital(@RequestParam("hospitalId") String hospitalId) {
        Map<String, Object> response = new HashMap<>();

        if (hospitalId != null && !hospitalId.isEmpty() && hospitalRepository.existsById(hospitalId)) {
            userRepository.unlinkUsersFromHospitals(Collections.singletonList(hospitalId));
            hospitalRepository.deleteById(hospitalId);
            response.put("ok", true);
            response.put("message", "Hospital deleted successfully");
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        response.put("message", "Hospital not found or missing hospitalId");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @PostMapping("/bulk-delete")
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, Object>> bulkDeleteHospitals(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        String type = (String) request.getOrDefault("type", "selected");
        int count = 0;

        if ("all".equalsIgnoreCase(type)) {
            userRepository.unlinkUsersFromAllHospitals();
            count = hospitalRepository.deleteAllHospitals();
        } else if ("selected".equalsIgnoreCase(type) || "single".equalsIgnoreCase(type)) {
            List<String> hospitalIds = (List<String>) request.get("hospitalIds");
            if (hospitalIds == null && request.containsKey("hospitalId")) {
                hospitalIds = Collections.singletonList((String) request.get("hospitalId"));
            }
            if (hospitalIds != null && !hospitalIds.isEmpty()) {
                userRepository.unlinkUsersFromHospitals(hospitalIds);
                count = hospitalRepository.deleteByHospitalIdIn(hospitalIds);
            }
        }

        response.put("ok", true);
        response.put("deletedCount", count);
        response.put("message", "Successfully deleted " + count + " hospital(s).");
        return ResponseEntity.ok(response);
    }
}
