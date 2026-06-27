package com.progile.prototype.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

private val LightColors = lightColorScheme(
    primary = ProgileBlue,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD9ECFF),
    onPrimaryContainer = ProgileText,
    secondary = ProgileGreen,
    background = ProgileBackground,
    onBackground = ProgileText,
    surface = ProgileSurface,
    onSurface = ProgileText,
    surfaceVariant = Color(0xFFF3F7FB),
    onSurfaceVariant = ProgileMuted,
    outline = ProgileBorder,
    error = ProgileRed
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF63B0FF),
    onPrimary = Color(0xFF001D36),
    primaryContainer = Color(0xFF164A73),
    onPrimaryContainer = ProgileDarkText,
    secondary = Color(0xFF4DD88A),
    background = ProgileDarkBackground,
    onBackground = ProgileDarkText,
    surface = ProgileDarkSurface,
    onSurface = ProgileDarkText,
    surfaceVariant = Color(0xFF202D42),
    onSurfaceVariant = ProgileDarkMuted,
    outline = ProgileDarkBorder,
    error = Color(0xFFFF6B72)
)

private val ProgileShapes = Shapes(
    extraSmall = RoundedCornerShape(6.dp),
    small = RoundedCornerShape(10.dp),
    medium = RoundedCornerShape(18.dp),
    large = RoundedCornerShape(22.dp),
    extraLarge = RoundedCornerShape(26.dp)
)

@Composable
fun ProgileTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        typography = ProgileTypography,
        shapes = ProgileShapes,
        content = content
    )
}
