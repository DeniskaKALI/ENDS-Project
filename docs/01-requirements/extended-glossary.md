# Расширенный технический глоссарий

| № | Термин | Тип | Назначение | Реализация |
|---:|---|---|---|---|
| 1 | `UserAccount` | JPA Entity | Серверная учётная запись с email, BCrypt-хешем и ролью. | [UserAccount.java](../../backend/src/main/java/com/progile/backend/model/UserAccount.java) |
| 2 | `RoleName` | Java Enum | Набор ролей `USER`, `DISPATCHER`, `LOGIST`, `ADMIN`, `MANAGER`, `DRIVER`. | [RoleName.java](../../backend/src/main/java/com/progile/backend/model/RoleName.java) |
| 3 | `TransportDto` | Java Record | REST-представление номера, модели, водителя, статуса, скорости и топлива. | [TransportDto.java](../../backend/src/main/java/com/progile/backend/dto/TransportDto.java) |
| 4 | `VehicleStatus` | Java/Kotlin Enum | Строго типизированное состояние транспортного средства. | [VehicleStatus.java](../../backend/src/main/java/com/progile/backend/model/VehicleStatus.java) |
| 5 | `RouteDto` | Java Record | REST-представление маршрута, точек, ETA и прогресса выполнения. | [RouteDto.java](../../backend/src/main/java/com/progile/backend/dto/RouteDto.java) |
| 6 | `RouteStatus` | Java/Kotlin Enum | Состояние маршрута: запланирован, активен или завершён. | [RouteStatus.java](../../backend/src/main/java/com/progile/backend/model/RouteStatus.java) |
| 7 | `TrackingDto` | Java Record | Координаты, скорость и время GPS-наблюдения. | [TrackingDto.java](../../backend/src/main/java/com/progile/backend/dto/TrackingDto.java) |
| 8 | `ReportDto` | Java Record | Метрики сформированного отчёта о рейсе. | [ReportDto.java](../../backend/src/main/java/com/progile/backend/dto/ReportDto.java) |
| 9 | `CommentDto` | Java Record | Данные комментария к транспортному объекту. | [CommentDto.java](../../backend/src/main/java/com/progile/backend/dto/CommentDto.java) |
| 10 | `ProgileViewModel` | Android ViewModel | Управляет авторизацией, навигацией, транспортом, маршрутами и настройками UI. | [ProgileViewModel.kt](../../android/app/src/main/java/com/progile/prototype/ui/ProgileViewModel.kt) |
| 11 | `AppUiState` | Kotlin Data Class | Единое неизменяемое состояние Android-приложения. | [ProgileViewModel.kt](../../android/app/src/main/java/com/progile/prototype/ui/ProgileViewModel.kt) |
| 12 | `LocalAuthRepository` | Kotlin Repository | Регистрирует локальных пользователей, проверяет хеши и восстанавливает сессию. | [AuthRepository.kt](../../android/app/src/main/java/com/progile/prototype/data/AuthRepository.kt) |
| 13 | `DemoTransportRepository` | Kotlin Repository | Предоставляет демонстрационные транспорт и маршруты специальной учётной записи. | [DemoRepository.kt](../../android/app/src/main/java/com/progile/prototype/data/DemoRepository.kt) |
| 14 | `SharedPreferences` | Android Storage | Хранит локальные аккаунты, соль, хеш пароля и email активной сессии. | [AuthRepository.kt](../../android/app/src/main/java/com/progile/prototype/data/AuthRepository.kt) |
| 15 | `TransportMap` | Compose Component | Загружает OpenStreetMap через WebView и включает Canvas-fallback при ошибке сети. | [MapPanel.kt](../../android/app/src/main/java/com/progile/prototype/ui/components/MapPanel.kt) |
