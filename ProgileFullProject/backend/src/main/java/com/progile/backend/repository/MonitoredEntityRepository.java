package com.progile.backend.repository;

import com.progile.backend.model.MonitoredEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonitoredEntityRepository extends JpaRepository<MonitoredEntity, Long> {
    List<MonitoredEntity> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrStatusContainingIgnoreCase(
            String name,
            String type,
            String status
    );
}
