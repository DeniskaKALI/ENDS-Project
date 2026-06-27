package com.progile.prototype.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.AltRoute
import androidx.compose.material.icons.automirrored.outlined.ShowChart
import androidx.compose.material.icons.outlined.CheckCircleOutline
import androidx.compose.material.icons.outlined.LocalShipping
import androidx.compose.material.icons.outlined.Speed
import androidx.compose.material.icons.outlined.WarningAmber
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.progile.prototype.model.DeliveryRoute
import com.progile.prototype.model.Vehicle
import com.progile.prototype.ui.components.MetricCard
import com.progile.prototype.ui.components.SectionTitle
import com.progile.prototype.ui.components.TransportMap
import com.progile.prototype.ui.theme.ProgileBlue
import com.progile.prototype.ui.theme.ProgileGray
import com.progile.prototype.ui.theme.ProgileGreen
import com.progile.prototype.ui.theme.ProgileOrange
import com.progile.prototype.ui.theme.ProgilePurple
import com.progile.prototype.ui.theme.ProgileRed

@Composable
fun HomeScreen(
    vehicles: List<Vehicle>,
    routes: List<DeliveryRoute>,
    modifier: Modifier = Modifier
) {
    val hasData = vehicles.isNotEmpty() || routes.isNotEmpty()
    val activeVehicles = if (hasData) 12 else 0
    val activeRoutes = if (hasData) 8 else 0
    val completedRoutes = if (hasData) 24 else 0
    val notifications = if (hasData) 3 else 0
    val averageSpeed = if (hasData) "68 км/ч" else "0 км/ч"
    val efficiency = if (hasData) "94%" else "0%"

    LazyColumn(
        modifier = modifier,
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Главная", style = MaterialTheme.typography.headlineMedium)
                Spacer(Modifier.weight(1f))
                Surface(
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(20.dp),
                    shadowElevation = 3.dp
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(Modifier.size(7.dp).background(ProgileRed, CircleShape))
                        Spacer(Modifier.size(6.dp))
                        Text("LIVE", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
            Text(
                "Мониторинг транспорта в реальном времени",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp)
            )
        }

        item {
            MetricRow(
                left = { MetricCard("Активные ТС", activeVehicles.toString(), Icons.Outlined.LocalShipping, ProgileBlue, if (hasData) "↑ 5%" else null, Modifier.weight(1f).height(92.dp)) },
                right = { MetricCard("Активные маршруты", activeRoutes.toString(), Icons.AutoMirrored.Outlined.AltRoute, ProgileGreen, if (hasData) "↑ 12%" else null, Modifier.weight(1f).height(92.dp)) }
            )
        }
        item {
            MetricRow(
                left = { MetricCard("Завершено", completedRoutes.toString(), Icons.Outlined.CheckCircleOutline, ProgilePurple, if (hasData) "↓ 3%" else null, Modifier.weight(1f).height(92.dp)) },
                right = { MetricCard("Уведомления", notifications.toString(), Icons.Outlined.WarningAmber, ProgileOrange, null, Modifier.weight(1f).height(92.dp)) }
            )
        }
        item {
            MetricRow(
                left = { MetricCard("Средняя скорость", averageSpeed, Icons.Outlined.Speed, ProgileBlue, null, Modifier.weight(1f).height(92.dp)) },
                right = { MetricCard("Эффективность", efficiency, Icons.AutoMirrored.Outlined.ShowChart, ProgileGreen, if (hasData) "↑ 8%" else null, Modifier.weight(1f).height(92.dp)) }
            )
        }

        item { SectionTitle("Статус в реальном времени", Modifier.padding(top = 4.dp)) }
        item {
            StatusRow(
                left = { StatusCard("В движении", if (hasData) "8" else "0", ProgileGreen, Modifier.weight(1f)) },
                right = { StatusCard("Остановка", if (hasData) "3" else "0", ProgileGray, Modifier.weight(1f)) }
            )
        }
        item {
            StatusRow(
                left = { StatusCard("Вне маршрута", if (hasData) "1" else "0", ProgileRed, Modifier.weight(1f)) },
                right = { StatusCard("Тех. обслуживание", "0", ProgileOrange, Modifier.weight(1f)) }
            )
        }

        item { SectionTitle("Карта транспорта", Modifier.padding(top = 6.dp)) }
        item {
            TransportMap(
                modifier = Modifier.height(210.dp),
                activeVehicleCount = activeVehicles,
                onRouteCount = activeRoutes
            )
        }
    }
}

@Composable
private fun MetricRow(left: @Composable RowScope.() -> Unit, right: @Composable RowScope.() -> Unit) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        left()
        right()
    }
}

@Composable
private fun StatusRow(left: @Composable RowScope.() -> Unit, right: @Composable RowScope.() -> Unit) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        left()
        right()
    }
}

@Composable
private fun StatusCard(label: String, value: String, color: Color, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.height(57.dp),
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(13.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        shadowElevation = 1.dp
    ) {
        Column(modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.size(7.dp).background(color, CircleShape))
                Spacer(Modifier.size(7.dp))
                Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1)
            }
            Text(value, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.padding(start = 14.dp))
        }
    }
}
