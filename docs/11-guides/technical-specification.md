# Техническое задание

## Android-клиент

- Kotlin и Jetpack Compose;
- Material 3 и нижняя навигация;
- семь экранов, включая вход и регистрацию;
- MVVM, `ProgileViewModel`, `StateFlow`;
- локальная регистрация с salted SHA-256;
- `DemoTransportRepository` для автономной демонстрации;
- интерактивная OpenStreetMap и Canvas-fallback без сети;
- сборка APK через Gradle/Android Studio.

## Сервер

- Java 17 и Spring Boot 3;
- REST API, более восьми endpoints;
- OpenAPI/Swagger UI;
- JWT, BCrypt и ролевой доступ;
- PostgreSQL и Spring Data JPA;
- JUnit, MockMvc и JaCoCo.

## Обязательные endpoints

| Метод | URL |
|---|---|
| POST | `/api/auth/login` |
| POST | `/api/auth/register` |
| GET | `/api/entities` |
| GET | `/api/entities/{id}` |
| POST | `/api/entities` |
| PUT | `/api/entities/{id}` |
| DELETE | `/api/entities/{id}` |
| GET | `/api/entities/search` |
