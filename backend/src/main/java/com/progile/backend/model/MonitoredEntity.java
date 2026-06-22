package com.progile.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "monitored_entities")
public class MonitoredEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String status;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    protected MonitoredEntity() {
    }

    public MonitoredEntity(Long id, String name, String type, String status, String description) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
        this.description = description;
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void update(String name, String type, String status, String description) {
        this.name = name;
        this.type = type;
        this.status = status;
        this.description = description;
        this.updatedAt = Instant.now();
    }
}
