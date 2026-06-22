package com.progile.backend.api;

import com.progile.backend.dto.TrackingDto;
import com.progile.backend.service.DataStore;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {
    private final DataStore store;

    public TrackingController(DataStore store) {
        this.store = store;
    }

    @GetMapping("/current")
    public TrackingDto current(@RequestParam long transportId) {
        return store.currentLocation(transportId);
    }

    @PostMapping
    public TrackingDto create(@Valid @RequestBody TrackingDto request) {
        return store.createTracking(request);
    }
}
