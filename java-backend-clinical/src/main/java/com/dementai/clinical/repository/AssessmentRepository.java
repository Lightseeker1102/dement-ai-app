package com.dementai.clinical.repository;

import com.dementai.clinical.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, String> {
    List<Assessment> findByUserId(String userId);

    @Query("SELECT a FROM Assessment a WHERE a.userId IN :userIds")
    List<Assessment> findByUserIdIn(@Param("userIds") List<String> userIds);

    @Transactional
    @Modifying
    @Query("DELETE FROM Assessment a WHERE a.userId = :userId")
    void deleteByUserId(@Param("userId") String userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Assessment a WHERE a.userId IN :userIds")
    void deleteByUserIdIn(@Param("userIds") List<String> userIds);

    @Transactional
    @Modifying
    @Query("DELETE FROM Assessment a WHERE a.userId IN (SELECT u.userId FROM User u WHERE u.riskTier IN :riskTiers)")
    void deleteByRiskTiers(@Param("riskTiers") List<String> riskTiers);

    @Transactional
    @Modifying
    @Query("DELETE FROM Assessment a")
    void deleteAllAssessments();
}
