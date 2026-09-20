package com.dementai.clinical.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dement_assessments")
public class Assessment {
    @Id
    @Column(name = "assessment_id", length = 64)
    private String id;

    @Column(name = "user_id", length = 64, nullable = false)
    private String userId;

    @Column(name = "assessment_type", length = 64, nullable = false)
    private String type;

    @Column(name = "assessment_date", length = 32)
    private String date;

    @Column(name = "score")
    private Integer score;

    @Column(name = "risk_tier", length = 16)
    private String riskTier;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "transcript_text", columnDefinition = "TEXT")
    private String transcriptText;

    public Assessment() {}

    public Assessment(String id, String userId, String type, String date, Integer score, String riskTier, Integer durationSeconds, String transcriptText) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.date = date;
        this.score = score;
        this.riskTier = riskTier;
        this.durationSeconds = durationSeconds;
        this.transcriptText = transcriptText;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getRiskTier() { return riskTier; }
    public void setRiskTier(String riskTier) { this.riskTier = riskTier; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public String getTranscriptText() { return transcriptText; }
    public void setTranscriptText(String transcriptText) { this.transcriptText = transcriptText; }
}
