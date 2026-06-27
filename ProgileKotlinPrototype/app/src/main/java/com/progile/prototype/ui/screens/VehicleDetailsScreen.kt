package com.progile.prototype.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
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
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.LocalGasStation
import androidx.compose.material.icons.outlined.LocalShipping
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.PersonOutline
import androidx.compose.material.icons.outlined.Phone
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Speed
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.progile.prototype.model.Vehicle
import com.progile.prototype.ui.components.LabelValue
import com.progile.prototype.ui.components.SegmentedTabs
import com.progile.prototype.ui.components.StatusPill
import com.progile.prototype.ui.components.TransportMap
import com.progile.prototype.ui.theme.ProgileBlue
import com.progile.prototype.ui.theme.ProgileGreen

@Composable
fun VehicleDetailsScreen(
    vehicle: Vehicle,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val uriHandler = LocalUriHandler.current

    Column(modifier = modifier.fillMaxSize()) {
        Surface(color = MaterialTheme.colorScheme.surface, shadowElevation = 1.dp) {
            Row(
                modifier = Modifier.fillMaxWidth().height(66.dp).padding(horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Назад")
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text(vehicle.plateNumber, style = MaterialTheme.typography.titleMedium)
                    Text(vehicle.model, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                StatusPill(vehicle.status)
                Spacer(Modifier.size(8.dp))
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(13.dp)
        ) {
            item { TransportMap(modifier = Modifier.height(250.dp), showStats = true) }

            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(18.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        Text("Информация", style = MaterialTheme.typography.titleLarge)

                        LabelValue("Транспорт", vehicle.model, Icons.Outlined.LocalShipping, iconTint = ProgileBlue)

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            LabelValue(
                                label = "Водитель",
                                value = vehicle.driverFull,
                                icon = Icons.Outlined.PersonOutline,
                                iconTint = ProgileBlue,
                                modifier = Modifier.weight(1f)
                            )
                            IconButton(
                                onClick = { uriHandler.openUri("tel:+79991234567") },
                                modifier = Modifier.background(MaterialTheme.colorScheme.surfaceVariant, CircleShape)
                            ) {
                                Icon(Icons.Outlined.Phone, contentDescription = "Позвонить", modifier = Modifier.size(18.dp))
                            }
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            LabelValue("Скорость", "${vehicle.speed} км/ч", Icons.Outlined.Speed, Modifier.weight(1f))
                            LabelValue("Топливо", "${vehicle.fuel}%", Icons.Outlined.LocalGasStation, Modifier.weight(1f))
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            LabelValue("Пройдено", "${vehicle.distanceKm} км", Icons.Outlined.LocationOn, Modifier.weight(1f))
                            LabelValue("В пути", vehicle.travelTime, Icons.Outlined.Schedule, Modifier.weight(1f))
                        }
                    }
                }
            }

            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(18.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(modifier = Modifier.padding(13.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        SegmentedTabs(
                            tabs = listOf("Движение", "Скорость", "Остановки", "Чат"),
                            selectedIndex = selectedTab,
                            onSelected = { selectedTab = it }
                        )
                        when (selectedTab) {
                            0 -> MovementDetails()
                            1 -> DetailMessage("Средняя скорость за рейс", "68 км/ч", ProgileBlue)
                            2 -> DetailMessage("Остановки на маршруте", "3 остановки · 42 мин", ProgileGreen)
                            else -> DetailMessage("Связь с водителем", "Последнее сообщение 8 мин назад", ProgileBlue)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun MovementDetails() {
    Column(verticalArrangement = Arrangement.spacedBy(7.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(7.dp).background(ProgileGreen, CircleShape))
            Spacer(Modifier.size(9.dp))
            Text("Москва — Санкт-Петербург", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
        }
        HorizontalDivider(color = MaterialTheme.colorScheme.outline)
        Text(
            "Начало: 09:00, ожидаемое прибытие: 18:30",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(start = 16.dp)
        )
    }
}

@Composable
private fun DetailMessage(title: String, value: String, color: Color) {
    Column {
        Text(title, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, style = MaterialTheme.typography.bodyLarge, color = color, fontWeight = FontWeight.SemiBold)
    }
}
