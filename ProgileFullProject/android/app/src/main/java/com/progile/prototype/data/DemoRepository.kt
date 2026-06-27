package com.progile.prototype.data

import com.progile.prototype.model.DeliveryRoute
import com.progile.prototype.model.RouteStatus
import com.progile.prototype.model.Vehicle
import com.progile.prototype.model.VehicleStatus

interface TransportRepository {
    fun getVehicles(): List<Vehicle>
    fun getRoutes(): List<DeliveryRoute>
    fun findVehicle(id: Long): Vehicle?
}

object DemoTransportRepository : TransportRepository {
    private val vehicles = listOf(
        Vehicle(1, "A123BC", "КАМАЗ 5320", "Иванов И.И.", "Иванов Иван Иванович", VehicleStatus.MOVING, 72, 75, 450, "5ч 20м", "2 мин назад"),
        Vehicle(2, "K456MH", "МАЗ 6303", "Петров П.П.", "Петров Пётр Павлович", VehicleStatus.OFF_ROUTE, 45, 48, 390, "4ч 10м", "5 мин назад"),
        Vehicle(3, "T789OP", "Volvo FH16", "Сидоров С.С.", "Сидоров Сергей Сергеевич", VehicleStatus.STOPPED, 0, 61, 610, "6ч 45м", "12 мин назад"),
        Vehicle(4, "E234YX", "Scania R500", "Орлов А.А.", "Орлов Алексей Андреевич", VehicleStatus.MOVING, 68, 82, 220, "2ч 50м", "1 мин назад"),
        Vehicle(5, "H567KM", "ГАЗон NEXT", "Кузнецов Д.В.", "Кузнецов Дмитрий Викторович", VehicleStatus.MAINTENANCE, 0, 35, 180, "—", "25 мин назад"),
        Vehicle(6, "B890CH", "MAN TGX", "Смирнов М.О.", "Смирнов Михаил Олегович", VehicleStatus.MOVING, 64, 69, 520, "5ч 55м", "3 мин назад")
    )

    private val routes = listOf(
        DeliveryRoute(1, "Москва — Санкт-Петербург", "Москва, ул. Складская 15", "Санкт-Петербург, пр. Индустриальный 42", "A123BC", "18:30", 65, RouteStatus.ACTIVE),
        DeliveryRoute(2, "Казань — Нижний Новгород", "Казань, Логистический центр", "Нижний Новгород, ТЦ Волга", "E234YX", "14:15", 42, RouteStatus.ACTIVE),
        DeliveryRoute(3, "Тула — Воронеж", "Тула, Московское шоссе 8", "Воронеж, ул. Дорожная 17", "B890CH", "20:40", 18, RouteStatus.ACTIVE),
        DeliveryRoute(4, "Москва — Ярославль", "Москва, СВХ", "Ярославль, Промышленная 3", "T789OP", "Завтра, 11:00", 0, RouteStatus.PLANNED),
        DeliveryRoute(5, "Рязань — Москва", "Рязань, склад № 2", "Москва, Южный терминал", "K456MH", "Выполнен", 100, RouteStatus.COMPLETED)
    )

    override fun getVehicles(): List<Vehicle> = vehicles
    override fun getRoutes(): List<DeliveryRoute> = routes
    override fun findVehicle(id: Long): Vehicle? = vehicles.find { it.id == id }
}
