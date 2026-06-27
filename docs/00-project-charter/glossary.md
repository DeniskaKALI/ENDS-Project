# Бизнес-глоссарий Progile

| № | Термин | Определение | Связь с проектом |
|---:|---|---|---|
| 1 | Progile | Мобильная система контроля транспорта, маршрутов, GPS-состояний и отчётов. | [Описание проекта](../../README.md) |
| 2 | Пользователь | Владелец учётной записи, который проходит вход и работает с доступными разделами приложения. | [AuthScreen.kt](../../android/app/src/main/java/com/progile/prototype/ui/screens/AuthScreen.kt) |
| 3 | Диспетчер | Пользователь, контролирующий транспорт, отклонения, остановки и выполнение маршрутов. | [ProfileScreen.kt](../../android/app/src/main/java/com/progile/prototype/ui/screens/ProfileScreen.kt) |
| 4 | Транспортное средство | Автомобиль с номером, моделью, водителем, скоростью, топливом и текущим статусом. | [Models.kt](../../android/app/src/main/java/com/progile/prototype/model/Models.kt) |
| 5 | Статус транспорта | Состояние автомобиля: в движении, остановка, вне маршрута или техническое обслуживание. | [VehicleStatus.java](../../backend/src/main/java/com/progile/backend/model/VehicleStatus.java) |
| 6 | Маршрут | План перевозки с начальной и конечной точками, автомобилем, временем прибытия и прогрессом. | [RouteDto.java](../../backend/src/main/java/com/progile/backend/dto/RouteDto.java) |
| 7 | GPS-снимок | Зафиксированные координаты, скорость и время положения транспортного средства. | [TrackingDto.java](../../backend/src/main/java/com/progile/backend/dto/TrackingDto.java) |
| 8 | Отчёт | Итоговые показатели рейса: пробег, средняя скорость, остановки и отклонения. | [ReportDto.java](../../backend/src/main/java/com/progile/backend/dto/ReportDto.java) |
| 9 | Комментарий | Текстовая запись пользователя, связанная с транспортом или маршрутом. | [CommentDto.java](../../backend/src/main/java/com/progile/backend/dto/CommentDto.java) |
| 10 | Регистрация | Создание локальной учётной записи с проверкой email и сохранением хеша пароля. | [AuthRepository.kt](../../android/app/src/main/java/com/progile/prototype/data/AuthRepository.kt) |
| 11 | Демонстрационная учётная запись | Специальная учётная запись, которой доступны все подготовленные маршруты, транспорт и отчёты. | [DemoRepository.kt](../../android/app/src/main/java/com/progile/prototype/data/DemoRepository.kt) |
| 12 | Офлайн-режим | Работа основных экранов с локальными данными и схемой карты без подключения к сети. | [MapPanel.kt](../../android/app/src/main/java/com/progile/prototype/ui/components/MapPanel.kt) |
| 13 | OpenStreetMap | Онлайн-карта, отображающая реальную дорожную сеть в экранах мониторинга. | [MapPanel.kt](../../android/app/src/main/java/com/progile/prototype/ui/components/MapPanel.kt) |
| 14 | JWT | Подписанный токен, которым Spring Boot backend подтверждает серверную аутентификацию пользователя. | [JwtService.java](../../backend/src/main/java/com/progile/backend/security/JwtService.java) |
| 15 | REST API | HTTP-интерфейс backend для аутентификации, транспорта, маршрутов, GPS, отчётов и комментариев. | [OpenAPI](../09-api/openapi.yaml) |
