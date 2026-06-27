package com.progile.prototype.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Logout
import androidx.compose.material.icons.outlined.Business
import androidx.compose.material.icons.outlined.ChevronRight
import androidx.compose.material.icons.outlined.DarkMode
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.NotificationsNone
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.progile.prototype.ui.components.StatusPill
import com.progile.prototype.ui.theme.ProgileBlue

@Composable
fun ProfileScreen(
    userName: String,
    userEmail: String,
    vehicleCount: Int,
    isDemoAccount: Boolean,
    notificationsEnabled: Boolean,
    darkTheme: Boolean,
    language: String,
    showPrivacy: Boolean,
    onNotificationsChanged: (Boolean) -> Unit,
    onDarkThemeChanged: (Boolean) -> Unit,
    onLanguageClick: () -> Unit,
    onPrivacyClick: () -> Unit,
    onPrivacyDismiss: () -> Unit,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier
) {
    val initials = userName
        .split(' ')
        .filter { it.isNotBlank() }
        .take(2)
        .joinToString("") { it.first().uppercase() }
        .ifBlank { "П" }
    val companyOrEmail = if (isDemoAccount) "ООО \"Прогайл Логистика\"" else userEmail

    Box(modifier = modifier.fillMaxSize()) {
        Box(Modifier.fillMaxWidth().height(174.dp).background(ProgileBlue))
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 14.dp)
        ) {
            item {
                Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 15.dp)) {
                    Text("Профиль", style = MaterialTheme.typography.headlineMedium, color = Color.White)
                    Spacer(Modifier.height(17.dp))
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(18.dp)
                    ) {
                        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier.size(54.dp).background(ProgileBlue.copy(alpha = 0.15f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(initials, style = MaterialTheme.typography.titleLarge, color = ProgileBlue)
                            }
                            Spacer(Modifier.size(13.dp))
                            Column {
                                Text(userName, style = MaterialTheme.typography.titleMedium)
                                Spacer(Modifier.height(4.dp))
                                StatusPill("Диспетчер", ProgileBlue)
                                Spacer(Modifier.height(4.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Outlined.Business, null, modifier = Modifier.size(15.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Spacer(Modifier.size(5.dp))
                                    Text(companyOrEmail, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 0.dp),
                    horizontalArrangement = Arrangement.spacedBy(9.dp)
                ) {
                    ProfileMetric(if (isDemoAccount) "156" else "0", "Рейсов", Modifier.weight(1f))
                    ProfileMetric(if (isDemoAccount) "12" else vehicleCount.toString(), "Транспорта", Modifier.weight(1f))
                    ProfileMetric(if (isDemoAccount) "4.8" else "—", "Рейтинг", Modifier.weight(1f))
                }
            }

            item {
                Text(
                    "Настройки",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(horizontal = 18.dp, vertical = 12.dp)
                )
                Surface(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(18.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column {
                        SettingSwitch(Icons.Outlined.NotificationsNone, "Уведомления", notificationsEnabled, onNotificationsChanged)
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                        SettingSwitch(Icons.Outlined.DarkMode, "Тёмная тема", darkTheme, onDarkThemeChanged)
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                        SettingLink(Icons.Outlined.Language, "Язык", language, onLanguageClick)
                    }
                }
            }

            item {
                Text(
                    "Поддержка",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(horizontal = 18.dp, vertical = 12.dp)
                )
                Surface(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(18.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column {
                        SettingLink(Icons.Outlined.Shield, "Политика конфиденциальности", null, onPrivacyClick)
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                        SettingLink(Icons.AutoMirrored.Outlined.Logout, "Выйти из аккаунта", null, onLogout)
                    }
                }
            }
        }
    }

    if (showPrivacy) {
        AlertDialog(
            onDismissRequest = onPrivacyDismiss,
            title = { Text("Политика конфиденциальности") },
            text = { Text("Демонстрационный прототип хранит все данные локально на устройстве и не передаёт персональные сведения сторонним сервисам.") },
            confirmButton = { TextButton(onClick = onPrivacyDismiss) { Text("Понятно") } }
        )
    }
}

@Composable
private fun ProfileMetric(value: String, label: String, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.height(82.dp),
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
            Text(value, style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(8.dp))
            Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun SettingSwitch(icon: ImageVector, label: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().height(76.dp).padding(horizontal = 13.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        SettingIcon(icon)
        Spacer(Modifier.size(11.dp))
        Text(label, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}

@Composable
private fun SettingLink(icon: ImageVector, label: String, value: String?, onClick: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().height(76.dp).clickable(onClick = onClick).padding(horizontal = 13.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        SettingIcon(icon)
        Spacer(Modifier.size(11.dp))
        Text(label, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
        if (value != null) {
            Text(value, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Spacer(Modifier.size(5.dp))
        Icon(Icons.Outlined.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
    }
}

@Composable
private fun SettingIcon(icon: ImageVector) {
    Box(
        modifier = Modifier.size(36.dp).background(ProgileBlue.copy(alpha = 0.08f), CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Icon(icon, contentDescription = null, tint = ProgileBlue, modifier = Modifier.size(19.dp))
    }
}
