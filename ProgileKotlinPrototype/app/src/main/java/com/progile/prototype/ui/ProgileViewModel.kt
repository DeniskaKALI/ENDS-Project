package com.progile.prototype.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.progile.prototype.data.AuthResult
import com.progile.prototype.data.AuthUser
import com.progile.prototype.data.DemoTransportRepository
import com.progile.prototype.data.LocalAuthRepository
import com.progile.prototype.data.TransportRepository
import com.progile.prototype.model.AppDestination
import com.progile.prototype.model.AppScreen
import com.progile.prototype.model.DeliveryRoute
import com.progile.prototype.model.Vehicle
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class AppUiState(
    val isAuthenticated: Boolean = false,
    val currentUserName: String = "",
    val currentUserEmail: String = "",
    val isDemoAccount: Boolean = false,
    val authError: String? = null,
    val screen: AppScreen = AppScreen.Main(AppDestination.HOME),
    val vehicles: List<Vehicle> = emptyList(),
    val routes: List<DeliveryRoute> = emptyList(),
    val notificationsEnabled: Boolean = true,
    val darkTheme: Boolean = false,
    val language: String = "Русский",
    val showPrivacy: Boolean = false
)

class ProgileViewModel(application: Application) : AndroidViewModel(application) {
    private val transportRepository: TransportRepository = DemoTransportRepository
    private val authRepository = LocalAuthRepository(application)
    private val _uiState = MutableStateFlow(AppUiState())
    val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()

    init {
        authRepository.restoreSession()?.let(::applyAuthenticatedUser)
    }

    fun login(email: String, password: String) {
        handleAuthResult(authRepository.login(email, password))
    }

    fun register(displayName: String, email: String, password: String, repeatedPassword: String) {
        handleAuthResult(authRepository.register(displayName, email, password, repeatedPassword))
    }

    fun clearAuthError() {
        _uiState.update { it.copy(authError = null) }
    }

    fun logout() {
        authRepository.logout()
        _uiState.value = AppUiState()
    }

    fun selectDestination(destination: AppDestination) {
        _uiState.update { it.copy(screen = AppScreen.Main(destination)) }
    }

    fun openVehicle(vehicleId: Long) {
        if (_uiState.value.vehicles.any { it.id == vehicleId }) {
            _uiState.update { it.copy(screen = AppScreen.VehicleDetails(vehicleId)) }
        }
    }

    fun closeVehicle() {
        selectDestination(AppDestination.TRANSPORT)
    }

    fun setNotifications(enabled: Boolean) {
        _uiState.update { it.copy(notificationsEnabled = enabled) }
    }

    fun setDarkTheme(enabled: Boolean) {
        _uiState.update { it.copy(darkTheme = enabled) }
    }

    fun toggleLanguage() {
        _uiState.update { it.copy(language = if (it.language == "Русский") "English" else "Русский") }
    }

    fun showPrivacy() {
        _uiState.update { it.copy(showPrivacy = true) }
    }

    fun hidePrivacy() {
        _uiState.update { it.copy(showPrivacy = false) }
    }

    fun vehicle(id: Long): Vehicle? = _uiState.value.vehicles.find { it.id == id }

    private fun handleAuthResult(result: AuthResult) {
        when (result) {
            is AuthResult.Success -> applyAuthenticatedUser(result.user)
            is AuthResult.Error -> _uiState.update { it.copy(authError = result.message) }
        }
    }

    private fun applyAuthenticatedUser(user: AuthUser) {
        _uiState.update {
            it.copy(
                isAuthenticated = true,
                currentUserName = user.displayName,
                currentUserEmail = user.email,
                isDemoAccount = user.isDemoAccount,
                authError = null,
                screen = AppScreen.Main(AppDestination.HOME),
                vehicles = if (user.isDemoAccount) transportRepository.getVehicles() else emptyList(),
                routes = if (user.isDemoAccount) transportRepository.getRoutes() else emptyList()
            )
        }
    }
}
