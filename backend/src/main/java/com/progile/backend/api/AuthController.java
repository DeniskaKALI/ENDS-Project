package com.progile.backend.api;

import com.progile.backend.dto.AuthDtos.AuthResponse;
import com.progile.backend.dto.AuthDtos.LoginRequest;
import com.progile.backend.dto.AuthDtos.RegisterRequest;
import com.progile.backend.security.JwtService;
import com.progile.backend.service.DataStore;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final DataStore store;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(DataStore store, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.store = store;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        var account = store.createUser(
                request.fullName(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.role(),
                request.company()
        );
        return response(account);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        var account = store.findUser(request.email())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), account.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid credentials");
        }
        return response(account);
    }

    private AuthResponse response(com.progile.backend.model.UserAccount account) {
        return new AuthResponse(
                account.getFullName(),
                account.getEmail(),
                account.getRole(),
                account.getCompany(),
                jwtService.generate(account)
        );
    }
}
