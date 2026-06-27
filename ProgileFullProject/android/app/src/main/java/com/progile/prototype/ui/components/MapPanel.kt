package com.progile.prototype.ui.components

import android.annotation.SuppressLint
import android.graphics.Color as AndroidColor
import android.view.View
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.progile.prototype.ui.theme.ProgileBlue
import com.progile.prototype.ui.theme.ProgileGreen
import com.progile.prototype.ui.theme.ProgileMap
import com.progile.prototype.ui.theme.ProgileOrange
import com.progile.prototype.ui.theme.ProgileRed

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun TransportMap(
    modifier: Modifier = Modifier,
    showStats: Boolean = false,
    activeVehicleCount: Int = 12,
    onRouteCount: Int = 8
) {
    val context = LocalContext.current
    var loading by remember { mutableStateOf(true) }
    var loadFailed by remember { mutableStateOf(false) }
    var webViewReference by remember { mutableStateOf<WebView?>(null) }
    val mapUrl = remember(showStats) {
        if (showStats) {
            "https://www.openstreetmap.org/export/embed.html?bbox=29.4%2C54.9%2C38.9%2C60.6&layer=mapnik&marker=55.7558%2C37.6173"
        } else {
            "https://www.openstreetmap.org/export/embed.html?bbox=37.42%2C55.64%2C37.86%2C55.87&layer=mapnik&marker=55.7558%2C37.6173"
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            webViewReference?.stopLoading()
            webViewReference?.destroy()
            webViewReference = null
        }
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(ProgileMap)
    ) {
        MapFallbackCanvas()

        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = {
                WebView(context).apply {
                    webViewReference = this
                    setBackgroundColor(AndroidColor.TRANSPARENT)
                    overScrollMode = View.OVER_SCROLL_NEVER
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                    settings.cacheMode = WebSettings.LOAD_DEFAULT
                    settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                    webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, url: String?) {
                            loading = false
                        }

                        override fun onReceivedError(
                            view: WebView?,
                            request: WebResourceRequest?,
                            error: WebResourceError?
                        ) {
                            if (request?.isForMainFrame == true) {
                                loading = false
                                loadFailed = true
                            }
                        }
                    }
                    loadUrl(mapUrl)
                }
            },
            update = { webView ->
                webView.visibility = if (loadFailed) View.GONE else View.VISIBLE
            }
        )

        if (loading && !loadFailed) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = ProgileBlue,
                strokeWidth = 3.dp
            )
        }

        if (loadFailed) {
            Surface(
                modifier = Modifier.align(Alignment.TopEnd).padding(9.dp),
                color = MaterialTheme.colorScheme.surface.copy(alpha = 0.92f),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(
                    "Карта офлайн",
                    style = MaterialTheme.typography.labelSmall,
                    color = ProgileRed,
                    modifier = Modifier.padding(horizontal = 9.dp, vertical = 5.dp)
                )
            }
        }

        if (showStats) {
            Row(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .fillMaxWidth()
                    .background(Color(0xB30A1A2A))
                    .padding(horizontal = 13.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                MapStat("Активных", "$activeVehicleCount ТС")
                MapStat("На маршруте", "$onRouteCount ТС")
            }
        }
    }
}

@Composable
private fun MapFallbackCanvas() {
    Canvas(Modifier.fillMaxSize()) {
        val gridColor = Color(0xFFBFDDF7).copy(alpha = 0.75f)
        val step = 18.dp.toPx()
        var x = 0f
        while (x <= size.width) {
            drawLine(gridColor, Offset(x, 0f), Offset(x, size.height), 1.dp.toPx())
            x += step
        }
        var y = 0f
        while (y <= size.height) {
            drawLine(gridColor, Offset(0f, y), Offset(size.width, y), 1.dp.toPx())
            y += step
        }

        val route = Path().apply {
            moveTo(size.width * 0.14f, size.height * 0.73f)
            cubicTo(
                size.width * 0.35f,
                size.height * 0.58f,
                size.width * 0.48f,
                size.height * 0.43f,
                size.width * 0.72f,
                size.height * 0.49f
            )
            lineTo(size.width * 0.87f, size.height * 0.27f)
        }
        drawPath(
            route,
            ProgileBlue.copy(alpha = 0.45f),
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 4.dp.toPx())
        )

        drawMapPin(Offset(size.width * 0.34f, size.height * 0.42f), ProgileGreen)
        drawMapPin(Offset(size.width * 0.64f, size.height * 0.52f), ProgileBlue)
        drawMapPin(Offset(size.width * 0.49f, size.height * 0.71f), ProgileOrange)
    }
}

private fun DrawScope.drawMapPin(center: Offset, color: Color) {
    val radius = 10.dp.toPx()
    val pin = Path().apply {
        moveTo(center.x, center.y + radius * 1.65f)
        cubicTo(
            center.x - radius * 0.35f,
            center.y + radius,
            center.x - radius,
            center.y + radius * 0.3f,
            center.x - radius,
            center.y
        )
        arcTo(
            rect = androidx.compose.ui.geometry.Rect(
                center.x - radius,
                center.y - radius,
                center.x + radius,
                center.y + radius
            ),
            startAngleDegrees = 180f,
            sweepAngleDegrees = 180f,
            forceMoveTo = false
        )
        cubicTo(
            center.x + radius,
            center.y + radius * 0.3f,
            center.x + radius * 0.35f,
            center.y + radius,
            center.x,
            center.y + radius * 1.65f
        )
        close()
    }
    drawPath(pin, color)
}

@Composable
private fun MapStat(label: String, value: String) {
    Column {
        Text(label, style = MaterialTheme.typography.labelSmall, color = Color.White.copy(alpha = 0.8f))
        Text(value, style = MaterialTheme.typography.bodyMedium, color = Color.White)
    }
}
