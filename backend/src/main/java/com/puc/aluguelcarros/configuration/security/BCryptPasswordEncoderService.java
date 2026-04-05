package com.puc.aluguelcarros.configuration.security;
import io.micronaut.core.annotation.NonNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import jakarta.inject.Singleton;

@Singleton
public class BCryptPasswordEncoderService {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String encode(@NonNull String rawPassword) {
        return encoder.encode(rawPassword);
    }

    public boolean matches(@NonNull String rawPassword, @NonNull String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}