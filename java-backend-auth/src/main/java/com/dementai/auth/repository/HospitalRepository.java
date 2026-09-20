package com.dementai.auth.repository;

import com.dementai.auth.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, String> {
    Optional<Hospital> findBySecretCode(String secretCode);
    Optional<Hospital> findByHospitalName(String hospitalName);
}
