package com.progile.prototype.model

enum class VehicleStatus(val label: String) {
    MOVING("В движении"),
    STOPPED("Остановка"),
    OFF_ROUTE("Вне маршрута"),
    MAINTENANCE("Тех. обслуживание")
}

data class Vehicle(
    val id: Long,
    val plateNumber: String,
    val model: String,
    val driverShort: String,
    val driverFull: String,
    val status: VehicleStatus,
    val speed: Int,
    val fuel: Int,
    val distanceKm: Int,
    val travelTime: String,
    val lastUpdate: String
)

enum class RouteStatus(val label: String) {
    ACTIVE("Активный"),
    PLANNED("План"),
    COMPLETED("Готово")
}

data class DeliveryRoute(
    val id: Long,
    val name: String,
    val startPoint: String,
    val endPoint: String,
    val vehiclePlate: String,
    val eta: String,
    val progress: Int,
    val status: RouteStatus
)

enum class AppDestination(val label: String) {
    HOME("Главная"),
    TRANSPORT("Транспорт"),
    ROUTES("Маршруты"),
    REPORTS("Отчёты"),
    PROFILE("Профиль")
}

sealed interface AppScreen {
    data class Main(val destination: AppDestination) : AppScreen
    data class VehicleDetails(val vehicleId: Long) : AppScreen
}
