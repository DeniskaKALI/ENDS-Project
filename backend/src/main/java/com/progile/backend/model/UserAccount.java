package com.progile.backend.model;

public class UserAccount {
    private final long id;
    private final String email;
    private final String passwordHash;
    private final String fullName;
    private final RoleName role;
    private final String company;

    public UserAccount(long id, String email, String passwordHash, String fullName, RoleName role, String company) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.company = company;
    }

    public long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public RoleName getRole() {
        return role;
    }

    public String getCompany() {
        return company;
    }
}
