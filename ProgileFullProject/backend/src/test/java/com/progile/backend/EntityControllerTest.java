package com.progile.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.progile.backend.dto.EntityDto;
import com.progile.backend.model.MonitoredEntity;
import com.progile.backend.repository.MonitoredEntityRepository;
import com.progile.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(com.progile.backend.api.EntityController.class)
@Import(TestSecurityConfig.class)
class EntityControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MonitoredEntityRepository repository;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser
    void returnsEntityList() throws Exception {
        when(repository.findAll()).thenReturn(List.of(new MonitoredEntity(1L, "Truck", "transport", "ACTIVE", "demo")));

        mvc.perform(get("/api/entities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Truck"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createsEntity() throws Exception {
        when(repository.save(any())).thenReturn(new MonitoredEntity(2L, "Route", "route", "PLANNED", "demo"));
        var request = new EntityDto(null, "Route", "route", "PLANNED", "demo", Instant.now());

        mvc.perform(post("/api/entities")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    @WithMockUser
    void returnsEntityById() throws Exception {
        when(repository.findById(1L)).thenReturn(Optional.of(new MonitoredEntity(1L, "Truck", "transport", "ACTIVE", "demo")));

        mvc.perform(get("/api/entities/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("transport"));
    }
}
