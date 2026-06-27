# Паттерны проектирования

| Паттерн | Реализация | Назначение |
|---|---|---|
| MVVM | `ProgileViewModel` + Compose screens | отделение состояния от UI |
| Repository | `TransportRepository`, `LocalAuthRepository`, Spring Data | абстракция источников данных |
| State Holder | `AppUiState` + `StateFlow` | единое предсказуемое состояние клиента |
| Adapter | WebView-компонент карты | встраивание OpenStreetMap в Compose |
| Fallback | Canvas-карта при сетевой ошибке | работа интерфейса без интернета |
| Controller | Spring REST controllers | отделение HTTP от бизнес-логики |
| Service Layer | `UserAccountService`, `DataStore` | серверные сценарии приложения |
| DTO | Java records | стабильный REST-контракт |
| Filter | `JwtAuthenticationFilter` | проверка JWT до контроллеров |
