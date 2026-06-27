package com.progile.backend;

import com.progile.backend.api.AuthController;
import com.progile.backend.dto.AuthDtos.ChangePasswordRequest;
import com.progile.backend.dto.AuthDtos.LoginRequest;
import com.progile.backend.dto.AuthDtos.ProfileRequest;
import com.progile.backend.dto.AuthDtos.RegisterRequest;
import com.progile.backend.model.RoleName;
import com.progile.backend.model.UserAccount;
import com.progile.backend.security.JwtService;
import com.progile.backend.service.UserAccountService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.TestingAuthenticationToken;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthControllerTest {
    private final UserAccountService accounts = mock(UserAccountService.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final AuthController controller = new AuthController(accounts, jwtService);

    @Test
    void loginReturnsAuthResponse() {
        var account = account();
        when(accounts.login("dispatcher@progile.ru", "demo123")).thenReturn(account);
        when(jwtService.generate(account)).thenReturn("jwt-token");

        var response = controller.login(new LoginRequest("dispatcher@progile.ru", "demo123"));

        assertEquals("dispatcher@progile.ru", response.email());
        assertEquals("jwt-token", response.token());
    }

    @Test
    void registerDelegatesToAccountService() {
        var request = new RegisterRequest("Dispatcher", "dispatcher@progile.ru", "demo123", RoleName.DISPATCHER, "Progile");
        var account = account();
        when(accounts.register(request)).thenReturn(account);
        when(jwtService.generate(account)).thenReturn("jwt-token");

        var response = controller.register(request);

        assertEquals(RoleName.DISPATCHER, response.role());
    }

    @Test
    void profileEndpointsUseAuthenticatedEmail() {
        var auth = new TestingAuthenticationToken("dispatcher@progile.ru", null);
        var account = account();
        var profile = new ProfileRequest("Admin", RoleName.ADMIN, "Progile HQ");
        when(accounts.getCurrent("dispatcher@progile.ru")).thenReturn(account);
        when(accounts.updateProfile("dispatcher@progile.ru", profile)).thenReturn(account);
        when(jwtService.generate(account)).thenReturn("jwt-token");

        controller.me(auth);
        controller.updateProfile(auth, profile);
        controller.changePassword(auth, new ChangePasswordRequest("demo123", "newpass123"));
        controller.deleteProfile(auth);

        verify(accounts).changePassword("dispatcher@progile.ru", new ChangePasswordRequest("demo123", "newpass123"));
        verify(accounts).deleteAccount("dispatcher@progile.ru");
    }

    private UserAccount account() {
        return new UserAccount(1L, "dispatcher@progile.ru", "hash", "Dispatcher", RoleName.DISPATCHER, "Progile");
    }
}
