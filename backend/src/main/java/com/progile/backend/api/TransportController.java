package com.progile.backend.api;

import com.progile.backend.dto.StatusRequest.VehicleStatusUpdate;
import com.progile.backend.dto.TransportDto;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transport")
public class TransportController {
    private final DataStore store;

    public TransportController(DataStore store) {
        this.store = store;
    }

    @GetMapping
    public List<TransportDto> list() {
        return store.listTransports();
    }

    @GetMapping("/{id}")
    public TransportDto get(@PathVariable long id) {
        return store.getTransport(id);
    }

    @GetMapping("/search")
    public List<TransportDto> search(@RequestParam String query) {
        return store.searchTransport(query);
    }

    @PostMapping
    public TransportDto create(@Valid @RequestBody TransportDto request) {
        return store.createTransport(request);
    }

    @PutMapping("/{id}")
    public TransportDto update(@PathVariable long id, @Valid @RequestBody TransportDto request) {
        return store.updateTransport(id, request);
    }

    @PatchMapping("/{id}/status")
    public TransportDto updateStatus(@PathVariable long id, @RequestBody VehicleStatusUpdate request) {
        return store.updateTransportStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        store.deleteTransport(id);
    }
}
