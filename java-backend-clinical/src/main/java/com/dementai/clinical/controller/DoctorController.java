package com.dementai.clinical.controller;

import com.dementai.clinical.model.Assessment;
import com.dementai.clinical.model.ClinicalNote;
import com.dementai.clinical.model.User;
import com.dementai.clinical.repository.AssessmentRepository;
import com.dementai.clinical.repository.ClinicalNoteRepository;
import com.dementai.clinical.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;

    public DoctorController(UserRepository userRepository, AssessmentRepository assessmentRepository, ClinicalNoteRepository clinicalNoteRepository) {
        this.userRepository = userRepository;
        this.assessmentRepository = assessmentRepository;
        this.clinicalNoteRepository = clinicalNoteRepository;
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
    public ResponseEntity<Map<String, Object>> getDoctorPatients(
            @RequestParam(value = "doctorEmail", required = false) String doctorEmail,
            @RequestParam(value = "doctorName", required = false) String doctorName,
            @RequestParam(value = "hospitalId", required = false) String hospitalId) {

        Map<String, Object> response = new HashMap<>();

        List<User> allPatients = userRepository.findByRole("user");
        List<User> assignedPatients = userRepository.findAssignedPatients(doctorEmail, doctorName);

        // Attach assessment history to all patients in 1 batch query
        attachAssessmentHistories(allPatients);

        response.put("ok", true);
        response.put("assignedPatients", assignedPatients);
        response.put("allPatients", allPatients);
        response.put("totalAssigned", assignedPatients.size());
        response.put("totalSystem", allPatients.size());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/link-patient")
    public ResponseEntity<Map<String, Object>> linkPatientToDoctor(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String userId = request.getOrDefault("userId", "").trim();
        String doctorName = request.getOrDefault("doctorName", "").trim();
        String doctorEmail = request.getOrDefault("doctorEmail", "").trim();
        String hospitalId = request.getOrDefault("hospitalId", "").trim();
        String hospitalName = request.getOrDefault("hospitalName", "").trim();

        if (userId.isEmpty()) {
            response.put("ok", false);
            response.put("message", "Patient User ID or Identifier is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<User> patientOpt = userRepository.findByIdentifier(userId);

        if (patientOpt.isPresent()) {
            User p = patientOpt.get();
            if (doctorName != null && !doctorName.isEmpty()) p.setDoctorName(doctorName);
            if (doctorEmail != null && !doctorEmail.isEmpty()) p.setDoctorEmail(doctorEmail);
            if (hospitalId != null && !hospitalId.isEmpty()) p.setHospitalId(hospitalId);
            if (hospitalName != null && !hospitalName.isEmpty()) p.setHospitalName(hospitalName);

            userRepository.save(p);

            response.put("ok", true);
            response.put("message", "Patient " + p.getFullName() + " successfully linked to Doctor " + doctorName);
            response.put("patient", p);
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        response.put("message", "Patient with ID or Username '" + userId + "' was not found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @GetMapping("/notes")
    public ResponseEntity<Map<String, Object>> getClinicalNotes(@RequestParam("userId") String userId) {
        Map<String, Object> response = new HashMap<>();
        List<ClinicalNote> notes = clinicalNoteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        response.put("ok", true);
        response.put("notes", notes);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/notes")
    public ResponseEntity<Map<String, Object>> createClinicalNote(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String userId = request.getOrDefault("userId", "").trim();
        String doctorId = request.getOrDefault("doctorId", "").trim();
        String doctorName = request.getOrDefault("doctorName", "Attending Clinician").trim();
        String noteType = request.getOrDefault("noteType", "SOAP_PROGRESS").trim();
        String noteContent = request.getOrDefault("noteContent", "").trim();

        if (userId.isEmpty() || noteContent.isEmpty()) {
            response.put("ok", false);
            response.put("message", "User ID and Note Content are required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        ClinicalNote note = new ClinicalNote();
        note.setNoteId("note-" + UUID.randomUUID().toString().substring(0, 8));
        note.setUserId(userId);
        note.setDoctorId(doctorId);
        note.setDoctorName(doctorName);
        note.setNoteType(noteType);
        note.setNoteContent(noteContent);
        note.setCreatedAt(new Date());

        ClinicalNote saved = clinicalNoteRepository.save(note);

        response.put("ok", true);
        response.put("note", saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/unlink-patient")
    public ResponseEntity<Map<String, Object>> unlinkPatientFromDoctor(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String userId = request.getOrDefault("userId", "").trim();

        if (userId.isEmpty()) {
            response.put("ok", false);
            response.put("message", "Patient ID is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<User> patientOpt = userRepository.findByIdentifier(userId);

        if (patientOpt.isPresent()) {
            User p = patientOpt.get();
            p.setDoctorName(null);
            p.setDoctorEmail(null);
            userRepository.save(p);

            response.put("ok", true);
            response.put("message", "Patient " + p.getFullName() + " unlinked from your roster.");
            return ResponseEntity.ok(response);
        }

        response.put("ok", false);
        response.put("message", "Patient not found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
