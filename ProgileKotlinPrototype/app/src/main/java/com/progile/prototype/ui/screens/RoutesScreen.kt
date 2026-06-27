package com.progile.prototype.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Navigation
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
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
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.progile.prototype.model.DeliveryRoute
import com.progile.prototype.model.RouteStatus
import com.progile.prototype.ui.components.NotificationTopBar
import com.progile.prototype.ui.components.SegmentedTabs
import com.progile.prototype.ui.components.StatusPill
import com.progile.prototype.ui.theme.ProgileBlue
import com.progile.prototype.ui.theme.ProgileGreen
import com.progile.prototype.ui.theme.ProgileRed

@Composable
fun RoutesScreen(routes: List<DeliveryRoute>, modifier: Modifier = Modifier) {
    var selectedTab by remember { mutableIntStateOf(1) }
    val filtered = when (selectedTab) {
        1 -> routes.filter { it.status == RouteStatus.ACTIVE }
        2 -> routes.filter { it.status == RouteStatus.PLANNED }
        3 -> routes.filter { it.status == RouteStatus.COMPLETED }
        else -> routes
    }

    Column(modifier = modifier.fillMaxSize()) {
        NotificationTopBar("Маршруты")
        Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 12.dp)) {
            Text("Маршруты", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(8.dp))
            SegmentedTabs(
                tabs = listOf("Все", "Активные", "План", "Готово"),
                selectedIndex = selectedTab,
                onSelected = { selectedTab = it }
            )
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp, vertical = 4.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (filtered.isEmpty()) {
                item { EmptyRoutesState() }
            }
            items(filtered, key = { it.id }) { route -> RouteCard(route) }
            item { Spacer(Modifier.height(5.dp)) }
        }
    }
}

@Composable
private fun EmptyRoutesState() {
    Column(
        modifier = Modifier.fillMaxWidth().padding(vertical = 54.dp, horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Surface(color = ProgileBlue.copy(alpha = 0.12f), shape = RoundedCornerShape(18.dp)) {
            Icon(
                Icons.Outlined.Navigation,
                contentDescription = null,
                tint = ProgileBlue,
                modifier = Modifier.padding(16.dp).size(30.dp)
            )
        }
        Text("Маршрутов пока нет", style = MaterialTheme.typography.titleMedium)
        Text(
            "Назначенные маршруты появятся в этом разделе",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun RouteCard(route: DeliveryRoute) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column(modifier = Modifier.padding(13.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(verticalAlignment = Alignment.Top) {
                Text(route.name, style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                StatusPill(route.status)
            }
            RoutePoint("Откуда:", route.startPoint, Icons.Outlined.LocationOn, ProgileGreen)
            RoutePoint("Куда:", route.endPoint, Icons.Outlined.Navigation, ProgileRed)
            Text(
                "Транспорт: ${route.vehiclePlate}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Outlined.Schedule, null, tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(16.dp))
                Spacer(Modifier.size(7.dp))
                Text("Прибытие: ", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(route.eta, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
            }
            Row {
                Text("Прогресс", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.weight(1f))
                Text("${route.progress}%", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
            }
            LinearProgressIndicator(
                progress = { route.progress / 100f },
                modifier = Modifier.fillMaxWidth().height(7.dp),
                color = ProgileBlue,
                trackColor = ProgileBlue.copy(alpha = 0.18f),
                strokeCap = StrokeCap.Round
            )
        }
    }
}

@Composable
private fun RoutePoint(
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: androidx.compose.ui.graphics.Color
) {
    Row(verticalAlignment = Alignment.Top) {
        Icon(icon, null, tint = color, modifier = Modifier.size(16.dp))
        Spacer(Modifier.size(8.dp))
        Column {
            Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(value, style = MaterialTheme.typography.bodyMedium)
        }
    }
}
