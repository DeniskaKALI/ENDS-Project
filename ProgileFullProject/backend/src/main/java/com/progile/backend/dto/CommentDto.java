package com.progile.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record CommentDto(
        Long id,
        Long transportId,
        Long routeId,
        @NotBlank String text,
        String author,
        Instant createdAt
) {
}
