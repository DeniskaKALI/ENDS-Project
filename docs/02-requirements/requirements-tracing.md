# Трассировка требований

| ID | Требование | Источник | Реализация |
|---|---|---|---|
| FR-01 | регистрация и вход | ЛР1, КП | `AuthController`, `UserAccountService`, `LoginScreen` |
| FR-02 | роли пользователей | ЛР1, ЛР2 | `RoleName`, JWT, Spring Security |
| FR-03 | список транспорта | ЛР1, ЛР2 | `TransportController`, `TransportScreen` |
| FR-04 | карточка ТС | ЛР2, ЛР7 | `VehicleDetailScreen` |
| FR-05 | маршруты | ЛР1-ЛР3 | `RouteController`, `RoutesScreen` |
| FR-06 | GPS-снимки | ЛР2, ЛР4 | `TrackingController`, `TrackingDto` |
| FR-07 | отчеты | ЛР1, ЛР2 | `ReportController`, `ReportsScreen` |
| FR-08 | комментарии | ЛР1, ЛР2 | `CommentController`, `CommentDto` |
| FR-09 | CRUD `/api/entities` | КП | `EntityController`, `MonitoredEntityRepository` |
| NFR-01 | JWT-безопасность | КП | `JwtService`, `JwtAuthenticationFilter` |
| NFR-02 | PostgreSQL | КП | `docker-compose.yml`, JPA repositories |
| NFR-03 | OpenAPI | КП | `OpenApiConfig`, `docs/09-api/openapi.yaml` |
| NFR-04 | offline mode | КП | `DemoTransportRepository`, SharedPreferences и Canvas fallback карты |
| NFR-05 | тесты > 40% | КП | JaCoCo threshold, backend tests |
