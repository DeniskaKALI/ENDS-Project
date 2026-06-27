package com.progile.backend;

import com.progile.backend.dto.AuthDtos.ChangePasswordRequest;
import com.progile.backend.dto.AuthDtos.ProfileRequest;
import com.progile.backend.dto.AuthDtos.RegisterRequest;
import com.progile.backend.model.RoleName;
import com.progile.backend.model.UserAccount;
import com.progile.backend.repository.UserAccountRepository;
import com.progile.backend.service.UserAccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserAccountServiceTest {
    private UserAccountRepository repository;
    private BCryptPasswordEncoder encoder;
    private UserAccountService service;

    @BeforeEach
    void setUp() {
        repository = mock(UserAccountRepository.class);
        encoder = new BCryptPasswordEncoder();
        service = new UserAccountService(repository, encoder);
        when(repository.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void registersUserWithEncodedPasswordAndNormalizedEmail() {
        var request = new RegisterRequest("Dispatcher", "USER@MAIL.RU", "secret123", RoleName.DISPATCHER, "Progile");

        var account = service.register(request);

        assertEquals("user@mail.ru", account.getEmail());
        assertEquals(RoleName.DISPATCHER, account.getRole());
        assertTrue(encoder.matches("secret123", account.getPasswordHash()));
        verify(repository).save(any(UserAccount.class));
    }

    @Test
    void rejectsDuplicateRegistration() {
        when(repository.existsByEmailIgnoreCase("user@mail.ru")).thenReturn(true);
        var request = new RegisterRequest("Dispatcher", "user@mail.ru", "secret123", RoleName.USER, "Progile");

        assertThrows(ResponseStatusException.class, () -> service.register(request));
    }

    @Test
    void logsInAndMarksLastLogin() {
        var account = new UserAccount("Dispatcher", "dispatcher@progile.ru", encoder.encode("demo123"), RoleName.DISPATCHER, "Progile");
        when(repository.findByEmailIgnoreCaseAndActiveTrue("dispatcher@progile.ru")).thenReturn(Optional.of(account));

        var result = service.login("dispatcher@progile.ru", "demo123");

        assertNotNull(result.getLastLogin());
        verify(repository).save(account);
    }

    @Test
    void rejectsInvalidPassword() {
        var account = new UserAccount("Dispatcher", "dispatcher@progile.ru", encoder.encode("demo123"), RoleName.DISPATCHER, "Progile");
        when(repository.findByEmailIgnoreCaseAndActiveTrue("dispatcher@progile.ru")).thenReturn(Optional.of(account));

        assertThrows(ResponseStatusException.class, () -> service.login("dispatcher@progile.ru", "wrong"));
    }

    @Test
    void updatesProfileChangesPasswordAndDeactivatesAccount() {
        var account = new UserAccount("Dispatcher", "dispatcher@progile.ru", encoder.encode("demo123"), RoleName.DISPATCHER, "Progile");
        when(repository.findByEmailIgnoreCaseAndActiveTrue("dispatcher@progile.ru")).thenReturn(Optional.of(account));

        service.updateProfile("dispatcher@progile.ru", new ProfileRequest("Admin", RoleName.ADMIN, "Progile HQ"));
        service.changePassword("dispatcher@progile.ru", new ChangePasswordRequest("demo123", "newpass123"));
        service.deleteAccount("dispatcher@progile.ru");

        assertEquals("Admin", account.getFullName());
        assertEquals("Progile HQ", account.getCompany());
        assertEquals(RoleName.ADMIN, account.getRole());
        assertTrue(encoder.matches("newpass123", account.getPasswordHash()));
        assertTrue(!account.isActive());
    }
}
