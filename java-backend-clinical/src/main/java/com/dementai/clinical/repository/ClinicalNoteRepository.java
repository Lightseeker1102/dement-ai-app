package com.dementai.clinical.repository;

import com.dementai.clinical.model.ClinicalNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, String> {
    List<ClinicalNote> findByUserIdOrderByCreatedAtDesc(String userId);
    List<ClinicalNote> findByDoctorIdOrderByCreatedAtDesc(String doctorId);
}
