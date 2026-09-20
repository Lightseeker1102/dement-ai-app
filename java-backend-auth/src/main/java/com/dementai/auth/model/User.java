package com.dementai.auth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dement_users")
public class User {
    @Id
    @Column(name = "user_id", length = 64)
    private String userId;

    @Column(name = "username", length = 64, unique = true, nullable = false)
    private String username;

    @Column(name = "password", length = 128, nullable = false)
    private String password;

    @Column(name = "full_name", length = 128)
    private String fullName;

    @Column(name = "email", length = 128)
    private String email;

    @Column(name = "phone", length = 32)
    private String phone;

    @Column(name = "age")
    private Integer age;

    @Column(name = "role", length = 16)
    private String role = "user";

    @Column(name = "risk_tier", length = 16)
    private String riskTier = "Monitor";

    @Column(name = "last_assessment_date", length = 32)
    private String lastAssessmentDate;

    @Column(name = "total_assessments")
    private Integer totalAssessments = 0;

    @Column(name = "doctor_name", length = 128)
    private String doctorName;

    @Column(name = "doctor_email", length = 128)
    private String doctorEmail;

    @Column(name = "security_question", length = 256)
    private String securityQuestion;

    @Column(name = "security_answer", length = 128)
    private String securityAnswer;

    @Column(name = "hospital_id", length = 64)
    private String hospitalId;

    @Column(name = "hospital_name", length = 128)
    private String hospitalName;

    @Column(name = "license_number", length = 64)
    private String licenseNumber;

    @Column(name = "medical_specialization", length = 128)
    private String medicalSpecialization;

    public User() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getRiskTier() { return riskTier; }
    public void setRiskTier(String riskTier) { this.riskTier = riskTier; }

    public String getLastAssessmentDate() { return lastAssessmentDate; }
    public void setLastAssessmentDate(String lastAssessmentDate) { this.lastAssessmentDate = lastAssessmentDate; }

    public Integer getTotalAssessments() { return totalAssessments; }
    public void setTotalAssessments(Integer totalAssessments) { this.totalAssessments = totalAssessments; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDoctorEmail() { return doctorEmail; }
    public void setDoctorEmail(String doctorEmail) { this.doctorEmail = doctorEmail; }

    public String getSecurityQuestion() { return securityQuestion; }
    public void setSecurityQuestion(String securityQuestion) { this.securityQuestion = securityQuestion; }

    public String getSecurityAnswer() { return securityAnswer; }
    public void setSecurityAnswer(String securityAnswer) { this.securityAnswer = securityAnswer; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getMedicalSpecialization() { return medicalSpecialization; }
    public void setMedicalSpecialization(String medicalSpecialization) { this.medicalSpecialization = medicalSpecialization; }
}
