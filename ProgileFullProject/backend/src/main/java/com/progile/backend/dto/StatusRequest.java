package com.progile.backend.dto;

import com.progile.backend.model.RouteStatus;
import com.progile.backend.model.VehicleStatus;

public final class StatusRequest {
    private StatusRequest() {
    }

    public record VehicleStatusUpdate(VehicleStatus status) {
    }

    public record RouteStatusUpdate(RouteStatus status) {
    }
}
