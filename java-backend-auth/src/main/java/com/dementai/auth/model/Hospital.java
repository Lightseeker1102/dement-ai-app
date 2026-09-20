package com.dementai.auth.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "dement_hospitals")
public class Hospital {

    @Id
    @Column(name = "hospital_id", length = 64)
    private String hospitalId;

    @Column(name = "hospital_name", length = 128, nullable = false)
    private String hospitalName;

    @Column(name = "secret_code", length = 64, unique = true, nullable = false)
    private String secretCode;

    @Column(name = "license_number", length = 64)
    private String licenseNumber;

    @Column(name = "location", length = 128)
    private String location;

    @Column(name = "contact_email", length = 128)
    private String contactEmail;

    @Column(name = "max_doctors")
    private Integer maxDoctors = 50;

    @Column(name = "status", length = 16)
    private String status = "ACTIVE";

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt = new Date();

    public Hospital() {}

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getSecretCode() { return secretCode; }
    public void setSecretCode(String secretCode) { this.secretCode = secretCode; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public Integer getMaxDoctors() { return maxDoctors; }
    public void setMaxDoctors(Integer maxDoctors) { this.maxDoctors = maxDoctors; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
