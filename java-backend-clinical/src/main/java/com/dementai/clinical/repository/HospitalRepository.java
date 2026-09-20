package com.dementai.clinical.repository;

import com.dementai.clinical.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, String> {
    Optional<Hospital> findBySecretCode(String secretCode);
    Optional<Hospital> findByHospitalName(String hospitalName);

    @Transactional
    @Modifying
    @Query("DELETE FROM Hospital h WHERE h.hospitalId IN :hospitalIds")
    int deleteByHospitalIdIn(@Param("hospitalIds") List<String> hospitalIds);

    @Transactional
    @Modifying
    @Query("DELETE FROM Hospital h")
    int deleteAllHospitals();
}
