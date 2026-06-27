package com.progile.prototype.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.progile.prototype.model.AppDestination
import com.progile.prototype.model.AppScreen
import com.progile.prototype.ui.components.ProgileBottomBar
import com.progile.prototype.ui.screens.AuthScreen
import com.progile.prototype.ui.screens.HomeScreen
import com.progile.prototype.ui.screens.ProfileScreen
import com.progile.prototype.ui.screens.ReportsScreen
import com.progile.prototype.ui.screens.RoutesScreen
import com.progile.prototype.ui.screens.TransportScreen
import com.progile.prototype.ui.screens.VehicleDetailsScreen
import com.progile.prototype.ui.theme.ProgileTheme

@Composable
fun ProgileApp(
    initialDestination: AppDestination = AppDestination.HOME,
    initialVehicleId: Long? = null,
    viewModel: ProgileViewModel = viewModel()
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(initialDestination, initialVehicleId, state.isAuthenticated) {
        if (!state.isAuthenticated) return@LaunchedEffect
        if (initialVehicleId != null) {
            viewModel.openVehicle(initialVehicleId)
        } else {
            viewModel.selectDestination(initialDestination)
        }
    }

    ProgileTheme(darkTheme = state.darkTheme) {
        Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
            if (!state.isAuthenticated) {
                AuthScreen(
                    errorMessage = state.authError,
                    onLogin = viewModel::login,
                    onRegister = viewModel::register,
                    onInputChanged = viewModel::clearAuthError
                )
                return@Surface
            }

            when (val screen = state.screen) {
                is AppScreen.Main -> {
                    Scaffold(
                        containerColor = MaterialTheme.colorScheme.background,
                        bottomBar = {
                            ProgileBottomBar(
                                current = screen.destination,
                                onDestinationSelected = viewModel::selectDestination
                            )
                        }
                    ) { innerPadding ->
                        val modifier = Modifier.fillMaxSize().padding(innerPadding)
                        when (screen.destination) {
                            AppDestination.HOME -> HomeScreen(state.vehicles, state.routes, modifier)
                            AppDestination.TRANSPORT -> TransportScreen(state.vehicles, viewModel::openVehicle, modifier)
                            AppDestination.ROUTES -> RoutesScreen(state.routes, modifier)
                            AppDestination.REPORTS -> ReportsScreen(hasData = state.isDemoAccount, modifier = modifier)
                            AppDestination.PROFILE -> ProfileScreen(
                                userName = state.currentUserName,
                                userEmail = state.currentUserEmail,
                                vehicleCount = state.vehicles.size,
                                isDemoAccount = state.isDemoAccount,
                                notificationsEnabled = state.notificationsEnabled,
                                darkTheme = state.darkTheme,
                                language = state.language,
                                showPrivacy = state.showPrivacy,
                                onNotificationsChanged = viewModel::setNotifications,
                                onDarkThemeChanged = viewModel::setDarkTheme,
                                onLanguageClick = viewModel::toggleLanguage,
                                onPrivacyClick = viewModel::showPrivacy,
                                onPrivacyDismiss = viewModel::hidePrivacy,
                                onLogout = viewModel::logout,
                                modifier = modifier
                            )
                        }
                    }
                }

                is AppScreen.VehicleDetails -> {
                    BackHandler(onBack = viewModel::closeVehicle)
                    val vehicle = viewModel.vehicle(screen.vehicleId)
                    if (vehicle != null) {
                        VehicleDetailsScreen(vehicle, viewModel::closeVehicle)
                    } else {
                        viewModel.closeVehicle()
                    }
                }
            }
        }
    }
}
