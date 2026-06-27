# Слои реализации

| Слой | Android-клиент | Backend |
|---|---|---|
| Presentation | Composable-экраны, Material 3 | JSON-ответы REST |
| Control | `MainActivity`, `ProgileViewModel`, состояние навигации | контроллеры пакета `api` |
| Mediator | `LocalAuthRepository`, `TransportRepository` | `UserAccountService`, `DataStore`, JWT filter |
| Entity | `Vehicle`, `DeliveryRoute`, `AuthUser`, `AppUiState` | DTO и JPA-модели |
| Foundation | SharedPreferences, WebView/OpenStreetMap, Canvas fallback | PostgreSQL, JPA, Swagger, Maven |
