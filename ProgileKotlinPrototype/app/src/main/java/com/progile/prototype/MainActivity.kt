package com.progile.prototype

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.progile.prototype.model.AppDestination
import com.progile.prototype.ui.ProgileApp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowInsetsControllerCompat(window, window.decorView).apply {
            hide(WindowInsetsCompat.Type.systemBars())
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        }

        val initialDestination = intent.getStringExtra("screen")
            ?.let { value -> runCatching { AppDestination.valueOf(value) }.getOrNull() }
            ?: AppDestination.HOME

        val initialVehicleId = intent.getLongExtra("vehicleId", -1L).takeIf { it > 0L }

        setContent {
            ProgileApp(
                initialDestination = initialDestination,
                initialVehicleId = initialVehicleId
            )
        }
    }
}
