package com.dementai.clinical.repository;

import com.dementai.clinical.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:identifier) OR LOWER(u.email) = LOWER(:identifier)")
    Optional<User> findByUsernameOrEmail(@Param("identifier") String identifier);

    @Query("SELECT u FROM User u WHERE u.userId = :identifier OR LOWER(u.username) = LOWER(:identifier) OR LOWER(u.email) = LOWER(:identifier)")
    Optional<User> findByIdentifier(@Param("identifier") String identifier);

    @Query("SELECT u FROM User u WHERE LOWER(u.role) = LOWER(:role)")
    List<User> findByRole(@Param("role") String role);

    @Query("SELECT u FROM User u WHERE LOWER(u.role) = LOWER(:role)")
    Page<User> findByRole(@Param("role") String role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE LOWER(u.role) = 'user' AND ((:doctorEmail IS NOT NULL AND :doctorEmail <> '' AND LOWER(u.doctorEmail) = LOWER(:doctorEmail)) OR (:doctorName IS NOT NULL AND :doctorName <> '' AND LOWER(u.doctorName) = LOWER(:doctorName)))")
    List<User> findAssignedPatients(@Param("doctorEmail") String doctorEmail, @Param("doctorName") String doctorName);

    @Query("SELECT u FROM User u WHERE LOWER(u.role) = 'user' AND ((:doctorEmail IS NOT NULL AND :doctorEmail <> '' AND LOWER(u.doctorEmail) = LOWER(:doctorEmail)) OR (:doctorName IS NOT NULL AND :doctorName <> '' AND LOWER(u.doctorName) = LOWER(:doctorName)))")
    Page<User> findAssignedPatients(@Param("doctorEmail") String doctorEmail, @Param("doctorName") String doctorName, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE LOWER(u.role) = LOWER(:role) AND u.hospitalId = :hospitalId")
    long countByRoleAndHospitalId(@Param("role") String role, @Param("hospitalId") String hospitalId);

    @Transactional
    @Modifying
    @Query("DELETE FROM User u WHERE LOWER(u.role) = 'user' OR u.role IS NULL")
    int deleteAllPatients();

    @Transactional
    @Modifying
    @Query("DELETE FROM User u WHERE u.riskTier IN :riskTiers AND (LOWER(u.role) = 'user' OR u.role IS NULL)")
    int deleteByRiskTierIn(@Param("riskTiers") List<String> riskTiers);

    @Transactional
    @Modifying
    @Query("DELETE FROM User u WHERE u.userId IN :userIds")
    int deleteByUserIdIn(@Param("userIds") List<String> userIds);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.hospitalId = NULL, u.hospitalName = NULL WHERE u.hospitalId IN :hospitalIds")
    int unlinkUsersFromHospitals(@Param("hospitalIds") List<String> hospitalIds);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.hospitalId = NULL, u.hospitalName = NULL WHERE u.hospitalId IS NOT NULL")
    int unlinkUsersFromAllHospitals();
}
