package com.progile.backend.api;

import com.progile.backend.dto.RouteDto;
import com.progile.backend.dto.StatusRequest.RouteStatusUpdate;
import com.progile.backend.service.DataStore;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
    private final DataStore store;

    public RouteController(DataStore store) {
        this.store = store;
    }

    @GetMapping
    public List<RouteDto> list() {
        return store.listRoutes();
    }

    @GetMapping("/{id}")
    public RouteDto get(@PathVariable long id) {
        return store.getRoute(id);
    }

    @PostMapping
    public RouteDto create(@Valid @RequestBody RouteDto request) {
        return store.createRoute(request);
    }

    @PutMapping("/{id}")
    public RouteDto update(@PathVariable long id, @Valid @RequestBody RouteDto request) {
        return store.updateRoute(id, request);
    }

    @PatchMapping("/{id}/status")
    public RouteDto updateStatus(@PathVariable long id, @RequestBody RouteStatusUpdate request) {
        return store.updateRouteStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        store.deleteRoute(id);
    }
}
