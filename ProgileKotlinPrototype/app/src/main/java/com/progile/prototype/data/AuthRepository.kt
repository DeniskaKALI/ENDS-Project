package com.progile.prototype.data

import android.content.Context
import android.util.Base64
import android.util.Patterns
import java.security.MessageDigest
import java.security.SecureRandom

data class AuthUser(
    val displayName: String,
    val email: String,
    val isDemoAccount: Boolean
)

sealed interface AuthResult {
    data class Success(val user: AuthUser) : AuthResult
    data class Error(val message: String) : AuthResult
}

class LocalAuthRepository(context: Context) {
    private val preferences = context.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)

    fun login(email: String, password: String): AuthResult {
        val normalizedEmail = email.trim().lowercase()
        if (!Patterns.EMAIL_ADDRESS.matcher(normalizedEmail).matches()) {
            return AuthResult.Error("Введите корректный адрес электронной почты")
        }
        if (password.isBlank()) {
            return AuthResult.Error("Введите пароль")
        }

        if (normalizedEmail == DEMO_EMAIL) {
            return if (sha256(password) == DEMO_PASSWORD_HASH) {
                AuthResult.Success(demoUser()).also { saveSession(normalizedEmail) }
            } else {
                AuthResult.Error("Неверная почта или пароль")
            }
        }

        val accountId = accountId(normalizedEmail)
        val storedEmail = preferences.getString("email_$accountId", null)
            ?: return AuthResult.Error("Пользователь с такой почтой не найден")
        val salt = preferences.getString("salt_$accountId", null)
            ?: return AuthResult.Error("Не удалось прочитать данные учётной записи")
        val passwordHash = preferences.getString("password_$accountId", null)
            ?: return AuthResult.Error("Не удалось прочитать данные учётной записи")

        if (sha256("$salt:$password") != passwordHash) {
            return AuthResult.Error("Неверная почта или пароль")
        }

        val displayName = preferences.getString("name_$accountId", null) ?: storedEmail.substringBefore('@')
        saveSession(storedEmail)
        return AuthResult.Success(AuthUser(displayName, storedEmail, false))
    }

    fun register(displayName: String, email: String, password: String, repeatedPassword: String): AuthResult {
        val cleanName = displayName.trim()
        val normalizedEmail = email.trim().lowercase()

        if (cleanName.length < 2) {
            return AuthResult.Error("Введите имя пользователя")
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(normalizedEmail).matches()) {
            return AuthResult.Error("Введите корректный адрес электронной почты")
        }
        if (normalizedEmail == DEMO_EMAIL) {
            return AuthResult.Error("Эта почта закреплена за демонстрационной учётной записью")
        }
        if (password.length < 8) {
            return AuthResult.Error("Пароль должен содержать не менее 8 символов")
        }
        if (password != repeatedPassword) {
            return AuthResult.Error("Пароли не совпадают")
        }

        val accountId = accountId(normalizedEmail)
        if (preferences.contains("email_$accountId")) {
            return AuthResult.Error("Пользователь с такой почтой уже зарегистрирован")
        }

        val saltBytes = ByteArray(16).also { SecureRandom().nextBytes(it) }
        val salt = Base64.encodeToString(saltBytes, Base64.NO_WRAP)
        preferences.edit()
            .putString("name_$accountId", cleanName)
            .putString("email_$accountId", normalizedEmail)
            .putString("salt_$accountId", salt)
            .putString("password_$accountId", sha256("$salt:$password"))
            .putString(SESSION_EMAIL, normalizedEmail)
            .apply()

        return AuthResult.Success(AuthUser(cleanName, normalizedEmail, false))
    }

    fun restoreSession(): AuthUser? {
        val email = preferences.getString(SESSION_EMAIL, null) ?: return null
        if (email == DEMO_EMAIL) return demoUser()

        val accountId = accountId(email)
        val storedEmail = preferences.getString("email_$accountId", null) ?: return null
        val displayName = preferences.getString("name_$accountId", null) ?: storedEmail.substringBefore('@')
        return AuthUser(displayName, storedEmail, false)
    }

    fun logout() {
        preferences.edit().remove(SESSION_EMAIL).apply()
    }

    private fun saveSession(email: String) {
        preferences.edit().putString(SESSION_EMAIL, email).apply()
    }

    private fun accountId(email: String): String = sha256(email).take(20)

    private fun demoUser() = AuthUser(
        displayName = "Иванов Иван Иванович",
        email = DEMO_EMAIL,
        isDemoAccount = true
    )

    private fun sha256(value: String): String = MessageDigest
        .getInstance("SHA-256")
        .digest(value.toByteArray(Charsets.UTF_8))
        .joinToString("") { "%02x".format(it) }

    private companion object {
        const val PREFERENCES_NAME = "progile_accounts"
        const val SESSION_EMAIL = "session_email"
        const val DEMO_EMAIL = "deniskaost2005@gmail.com"
        const val DEMO_PASSWORD_HASH = "c8c990fedff1dfe99495eec059b0f4edb3b2ac8c3aa147e8327e8c2eaafc9dd8"
    }
}
