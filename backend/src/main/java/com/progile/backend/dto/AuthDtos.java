package com.progile.backend.dto;

import com.progile.backend.model.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record RegisterRequest(
            @NotBlank String fullName,
            @Email @NotBlank String email,
            @NotBlank String password,
            @NotNull RoleName role,
            @NotBlank String company
    ) {
    }

    public record AuthResponse(
            String fullName,
            String email,
            RoleName role,
            String company,
            String token
    ) {
    }
}
