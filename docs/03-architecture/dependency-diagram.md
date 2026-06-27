# Диаграмма зависимостей

![Диаграмма зависимостей компонентов](../images/07-dependency-diagram.png)

Исходное описание диаграммы в формате Mermaid:

```mermaid
flowchart LR
    app["Android Kotlin application"] --> compose["Jetpack Compose / Material 3"]
    app --> vm["ProgileViewModel / StateFlow"]
    vm --> auth["LocalAuthRepository"]
    vm --> demo["DemoTransportRepository"]
    auth --> prefs[("SharedPreferences")]
    app --> osm["OpenStreetMap WebView"]
    vm -. "точка расширения" .-> api["Spring Boot REST API"]
    api --> security["Spring Security / JWT / BCrypt"]
    api --> jpa["Spring Data JPA"]
    api --> openapi["OpenAPI / Swagger UI"]
    jpa --> db[("PostgreSQL")]
```

Текущая Android-сборка работает как автономный прототип. Серверный API находится в папке `backend` и подготовлен для последующей замены демонстрационного репозитория сетевой реализацией.
