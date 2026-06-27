package com.progile.backend.api;

import com.progile.backend.dto.AuthDtos.AuthResponse;
import com.progile.backend.dto.AuthDtos.ChangePasswordRequest;
import com.progile.backend.dto.AuthDtos.LoginRequest;
import com.progile.backend.dto.AuthDtos.MessageResponse;
import com.progile.backend.dto.AuthDtos.ProfileRequest;
import com.progile.backend.dto.AuthDtos.RegisterRequest;
import com.progile.backend.model.UserAccount;
import com.progile.backend.security.JwtService;
import com.progile.backend.service.UserAccountService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserAccountService accounts;
    private final JwtService jwtService;

    public AuthController(UserAccountService accounts, JwtService jwtService) {
        this.accounts = accounts;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        var account = accounts.register(request);
        return response(account);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        var account = accounts.login(request.email(), request.password());
        return response(account);
    }

    @GetMapping("/me")
    public AuthResponse me(Authentication authentication) {
        var account = accounts.getCurrent(currentEmail(authentication));
        return response(account);
    }

    @PutMapping("/profile")
    public AuthResponse updateProfile(Authentication authentication, @Valid @RequestBody ProfileRequest request) {
        var account = accounts.updateProfile(currentEmail(authentication), request);
        return response(account);
    }

    @PutMapping("/change-password")
    public MessageResponse changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        accounts.changePassword(currentEmail(authentication), request);
        return new MessageResponse("Password changed successfully");
    }

    @DeleteMapping("/profile")
    public MessageResponse deleteProfile(Authentication authentication) {
        accounts.deleteAccount(currentEmail(authentication));
        return new MessageResponse("Account deleted successfully");
    }

    private String currentEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(UNAUTHORIZED, "Authentication required");
        }
        return authentication.getName();
    }

    private AuthResponse response(UserAccount account) {
        return new AuthResponse(
                account.getId(),
                account.getFullName(),
                account.getEmail(),
                account.getRole(),
                account.getCompany(),
                jwtService.generate(account)
        );
    }
}
