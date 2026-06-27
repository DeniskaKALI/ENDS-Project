package com.progile.backend;

import com.progile.backend.model.RoleName;
import com.progile.backend.model.UserAccount;
import com.progile.backend.security.JwtService;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {
    @Test
    void generatesTokenAndExtractsEmail() {
        var service = new JwtService("progile-course-project-secret-key-2026-minimum-32-bytes", 60);
        var account = new UserAccount(1L, "dispatcher@progile.ru", "hash", "Dispatcher", RoleName.DISPATCHER, "Progile");

        var token = service.generate(account);

        assertThat(token).isNotBlank();
        assertThat(service.extractEmail(token)).isEqualTo("dispatcher@progile.ru");
    }
}
