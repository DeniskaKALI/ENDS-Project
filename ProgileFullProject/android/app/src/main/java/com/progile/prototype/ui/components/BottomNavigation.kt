package com.progile.prototype.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.AltRoute
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.LocalShipping
import androidx.compose.material.icons.outlined.PersonOutline
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.progile.prototype.model.AppDestination

@Composable
fun ProgileBottomBar(
    current: AppDestination,
    onDestinationSelected: (AppDestination) -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 12.dp
    ) {
        Row(modifier = Modifier.height(64.dp)) {
            BottomItem(AppDestination.HOME, Icons.Outlined.GridView, current, onDestinationSelected)
            BottomItem(AppDestination.TRANSPORT, Icons.Outlined.LocalShipping, current, onDestinationSelected)
            BottomItem(AppDestination.ROUTES, Icons.AutoMirrored.Outlined.AltRoute, current, onDestinationSelected)
            BottomItem(AppDestination.REPORTS, Icons.Outlined.BarChart, current, onDestinationSelected)
            BottomItem(AppDestination.PROFILE, Icons.Outlined.PersonOutline, current, onDestinationSelected)
        }
    }
}

@Composable
private fun RowScope.BottomItem(
    destination: AppDestination,
    icon: ImageVector,
    current: AppDestination,
    onDestinationSelected: (AppDestination) -> Unit
) {
    val selected = current == destination
    val color = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
    Box(
        modifier = Modifier
            .weight(1f)
            .height(64.dp)
            .clickable { onDestinationSelected(destination) },
        contentAlignment = Alignment.Center
    ) {
        if (selected) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 3.dp)
                    .width(38.dp)
                    .height(3.dp)
                    .background(MaterialTheme.colorScheme.primary, MaterialTheme.shapes.extraSmall)
            )
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(icon, contentDescription = destination.label, tint = color, modifier = Modifier.size(22.dp))
            Text(
                text = destination.label,
                color = color,
                fontSize = 9.sp,
                lineHeight = 12.sp,
                letterSpacing = 0.sp
            )
        }
    }
}
