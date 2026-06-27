package com.progile.prototype.ui.screens

import android.graphics.Paint
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.progile.prototype.ui.components.NotificationTopBar
import com.progile.prototype.ui.components.SegmentedTabs
import com.progile.prototype.ui.theme.ProgileBlue
import com.progile.prototype.ui.theme.ProgileGreen

@Composable
fun ReportsScreen(hasData: Boolean, modifier: Modifier = Modifier) {
    var selectedTab by remember { mutableIntStateOf(0) }

    Column(modifier = modifier.fillMaxSize()) {
        NotificationTopBar("Отчёты")
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 14.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text("Отчёты", style = MaterialTheme.typography.headlineMedium)
                Spacer(Modifier.height(8.dp))
                SegmentedTabs(
                    tabs = listOf("Маршруты", "Водители", "Транспорт", "KPI"),
                    selectedIndex = selectedTab,
                    onSelected = { selectedTab = it }
                )
            }
            item { WeeklySummary(selectedTab, hasData) }
            item { RoutesChart(selectedTab, hasData) }
            item { Spacer(Modifier.height(4.dp)) }
        }
    }
}

@Composable
private fun WeeklySummary(selectedTab: Int, hasData: Boolean) {
    val data = if (!hasData) {
        listOf("0", "0", "0 км/ч", "0 км")
    } else when (selectedTab) {
        1 -> listOf("24", "3", "71 км/ч", "4.8")
        2 -> listOf("12", "8", "68 км/ч", "94%")
        3 -> listOf("94%", "97%", "8 мин", "4.8")
        else -> listOf("92", "8", "68 км/ч", "8,450 км")
    }
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(18.dp)) {
            Text("Сводка за неделю", style = MaterialTheme.typography.titleMedium)
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ReportMetric("Завершено", data[0], "↑ 12%", Modifier.weight(1f))
                ReportMetric("В работе", data[1], null, Modifier.weight(1f))
            }
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ReportMetric("Средняя скорость", data[2], null, Modifier.weight(1f))
                ReportMetric("Пробег", data[3], null, Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun ReportMetric(label: String, value: String, delta: String?, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, style = MaterialTheme.typography.headlineMedium)
        if (delta != null) {
            Text(delta, style = MaterialTheme.typography.labelSmall, color = ProgileGreen)
        }
    }
}

@Composable
private fun RoutesChart(selectedTab: Int, hasData: Boolean) {
    val values = if (!hasData) {
        List(7) { 0 }
    } else when (selectedTab) {
        1 -> listOf(9, 13, 17, 15, 19, 11, 7)
        2 -> listOf(14, 17, 16, 19, 22, 12, 9)
        3 -> listOf(15, 18, 20, 19, 23, 16, 12)
        else -> listOf(12, 15, 18, 14, 21, 8, 5)
    }
    val gridColor = MaterialTheme.colorScheme.outline
    val labelColor = MaterialTheme.colorScheme.onSurfaceVariant

    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("Выполнение маршрутов", style = MaterialTheme.typography.titleMedium)
            Canvas(modifier = Modifier.fillMaxWidth().height(205.dp)) {
                val left = 32.dp.toPx()
                val top = 12.dp.toPx()
                val bottom = size.height - 24.dp.toPx()
                val right = size.width - 4.dp.toPx()
                val chartHeight = bottom - top
                val chartWidth = right - left
                val nativePaint = Paint().apply {
                    color = labelColor.toArgb()
                    textSize = 10.dp.toPx()
                    isAntiAlias = true
                    textAlign = Paint.Align.CENTER
                }

                listOf(0, 6, 12, 18, 24).forEach { tick ->
                    val y = bottom - chartHeight * (tick / 24f)
                    drawLine(gridColor, Offset(left, y), Offset(right, y), 1.dp.toPx())
                    nativePaint.textAlign = Paint.Align.RIGHT
                    drawContext.canvas.nativeCanvas.drawText(tick.toString(), left - 6.dp.toPx(), y + 3.dp.toPx(), nativePaint)
                }

                drawLine(labelColor, Offset(left, top), Offset(left, bottom), 1.dp.toPx())
                drawLine(labelColor, Offset(left, bottom), Offset(right, bottom), 1.dp.toPx())

                val labels = listOf("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс")
                val slot = chartWidth / values.size
                val barWidth = slot * 0.38f
                values.forEachIndexed { index, value ->
                    val x = left + slot * index + slot / 2f
                    val barHeight = chartHeight * (value / 24f)
                    drawRoundRect(
                        color = ProgileBlue.copy(alpha = 0.2f),
                        topLeft = Offset(x - barWidth / 2f, bottom - barHeight),
                        size = Size(barWidth, barHeight),
                        cornerRadius = androidx.compose.ui.geometry.CornerRadius(5.dp.toPx(), 5.dp.toPx())
                    )
                    drawLine(ProgileBlue, Offset(x - barWidth / 2f, bottom - barHeight), Offset(x - barWidth / 2f, bottom), 1.dp.toPx())
                    nativePaint.textAlign = Paint.Align.CENTER
                    drawContext.canvas.nativeCanvas.drawText(labels[index], x, bottom + 16.dp.toPx(), nativePaint)
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(15.dp)) {
                ChartLegend("Завершено", ProgileBlue)
                ChartLegend("Запланировано", ProgileBlue.copy(alpha = 0.22f))
            }
        }
    }
}

@Composable
private fun ChartLegend(label: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(9.dp).background(color, CircleShape))
        Spacer(Modifier.size(6.dp))
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
