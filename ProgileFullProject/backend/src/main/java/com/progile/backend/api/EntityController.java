package com.progile.backend.api;

import com.progile.backend.dto.EntityDto;
import com.progile.backend.model.MonitoredEntity;
import com.progile.backend.repository.MonitoredEntityRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/entities")
public class EntityController {
    private final MonitoredEntityRepository repository;

    public EntityController(MonitoredEntityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<EntityDto> list() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public EntityDto get(@PathVariable long id) {
        return toDto(find(id));
    }

    @PostMapping
    public EntityDto create(@Valid @RequestBody EntityDto request) {
        var saved = repository.save(new MonitoredEntity(null, request.name(), request.type(), request.status(), request.description()));
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public EntityDto update(@PathVariable long id, @Valid @RequestBody EntityDto request) {
        var entity = find(id);
        entity.update(request.name(), request.type(), request.status(), request.description());
        return toDto(repository.save(entity));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        repository.delete(find(id));
    }

    @GetMapping("/search")
    public List<EntityDto> search(@RequestParam String query) {
        return repository.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrStatusContainingIgnoreCase(query, query, query)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private MonitoredEntity find(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Entity not found"));
    }

    private EntityDto toDto(MonitoredEntity entity) {
        return new EntityDto(
                entity.getId(),
                entity.getName(),
                entity.getType(),
                entity.getStatus(),
                entity.getDescription(),
                entity.getUpdatedAt()
        );
    }
}
