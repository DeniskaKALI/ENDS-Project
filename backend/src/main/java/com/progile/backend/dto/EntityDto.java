package com.progile.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record EntityDto(
        Long id,
        @NotBlank String name,
        @NotBlank String type,
        @NotBlank String status,
        String description,
        Instant updatedAt
) {
}
