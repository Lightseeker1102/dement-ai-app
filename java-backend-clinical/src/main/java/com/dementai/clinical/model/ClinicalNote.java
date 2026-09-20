package com.dementai.clinical.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "dement_clinical_notes")
public class ClinicalNote {

    @Id
    @Column(name = "note_id", length = 64)
    private String noteId;

    @Column(name = "user_id", length = 64, nullable = false)
    private String userId;

    @Column(name = "doctor_id", length = 64)
    private String doctorId;

    @Column(name = "doctor_name", length = 128)
    private String doctorName;

    @Column(name = "note_type", length = 32)
    private String noteType = "SOAP_PROGRESS"; // SOAP_PROGRESS, DIAGNOSTIC, RECOMMENDATION, EMERGENCY

    @Lob
    @Column(name = "note_content")
    private String noteContent;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt = new Date();

    public ClinicalNote() {}

    public String getNoteId() { return noteId; }
    public void setNoteId(String noteId) { this.noteId = noteId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getNoteType() { return noteType; }
    public void setNoteType(String noteType) { this.noteType = noteType; }

    public String getNoteContent() { return noteContent; }
    public void setNoteContent(String noteContent) { this.noteContent = noteContent; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
