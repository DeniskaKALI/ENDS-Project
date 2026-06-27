package com.progile.backend.dto;

import com.progile.backend.model.VehicleStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TransportDto(
        Long id,
        @NotBlank String plateNumber,
        @NotBlank String model,
        @NotBlank String driver,
        @NotBlank String type,
        @NotNull VehicleStatus status,
        @Min(0) @Max(160) int speed,
        @Min(0) @Max(100) int fuel,
        String lastUpdate
) {
}
