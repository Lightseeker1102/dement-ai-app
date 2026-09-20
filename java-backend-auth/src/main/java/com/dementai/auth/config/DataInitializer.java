package com.dementai.auth.config;

import com.dementai.auth.model.User;
import com.dementai.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Ensure standard system administrator account exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUserId("admin");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("1234567"));
            admin.setFullName("System Administrator");
            admin.setEmail("admin@dementai.org");
            admin.setRole("admin");
            admin.setRiskTier("Low");
            admin.setSecurityQuestion("What is your admin key?");
            admin.setSecurityAnswer("dementai");

            userRepository.save(admin);
        }
    }
}
