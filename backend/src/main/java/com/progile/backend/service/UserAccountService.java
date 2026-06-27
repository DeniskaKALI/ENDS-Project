package com.progile.backend.service;

import com.progile.backend.dto.AuthDtos.ChangePasswordRequest;
import com.progile.backend.dto.AuthDtos.ProfileRequest;
import com.progile.backend.dto.AuthDtos.RegisterRequest;
import com.progile.backend.model.RoleName;
import com.progile.backend.model.UserAccount;
import com.progile.backend.repository.UserAccountRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.Optional;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
@Transactional
public class UserAccountService {
    private final UserAccountRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(UserAccountRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    void seedDemoUser() {
        if (!repository.existsByEmailIgnoreCase("dispatcher@progile.ru")) {
            repository.save(new UserAccount(
                    "Иванов Иван Иванович",
                    "dispatcher@progile.ru",
                    passwordEncoder.encode("demo123"),
                    RoleName.DISPATCHER,
                    "ООО \"Прогайл Логистика\""
            ));
        }
    }

    public Optional<UserAccount> findActiveUser(String email) {
        return repository.findByEmailIgnoreCaseAndActiveTrue(normalizeEmail(email));
    }

    public UserAccount register(RegisterRequest request) {
        var email = normalizeEmail(request.email());
        if (repository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(CONFLICT, "User already exists");
        }
        var account = new UserAccount(
                request.fullName(),
                email,
                passwordEncoder.encode(request.password()),
                request.role(),
                request.company()
        );
        return repository.save(account);
    }

    public UserAccount login(String email, String password) {
        var account = findActiveUser(email)
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(password, account.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid credentials");
        }
        account.markLogin();
        return repository.save(account);
    }

    public UserAccount getCurrent(String email) {
        return findActiveUser(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
    }

    public UserAccount updateProfile(String email, ProfileRequest request) {
        var account = getCurrent(email);
        account.updateProfile(request.fullName(), request.company(), request.role());
        return repository.save(account);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        var account = getCurrent(email);
        if (!passwordEncoder.matches(request.currentPassword(), account.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid current password");
        }
        account.changePassword(passwordEncoder.encode(request.newPassword()));
        repository.save(account);
    }

    public void deleteAccount(String email) {
        var account = getCurrent(email);
        account.deactivate();
        repository.save(account);
    }

    private String normalizeEmail(String email) {
        return email.toLowerCase(Locale.ROOT).trim();
    }
}
