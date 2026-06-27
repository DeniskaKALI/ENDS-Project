# Контекстная диаграмма

```mermaid
flowchart LR
    dispatcher["Диспетчер / логист"] --> app["Android Progile"]
    driver["Водитель"] --> app
    manager["Руководитель"] --> app
    admin["Администратор"] --> app
    app --> local[("SharedPreferences / DemoTransportRepository")]
    app --> osm["OpenStreetMap"]
    app -. "плановая интеграция" .-> api["Spring Boot REST API"]
    api --> db[("PostgreSQL")]
    api --> swagger["Swagger UI / OpenAPI"]
    api --> reports["Отчёты и аналитика"]
```

Текущий Android-прототип автономен: локальная учётная запись, транспорт и маршруты не требуют сервера. Backend реализует промышленный REST-контракт, JWT, роли и PostgreSQL и подготовлен к подключению через реализацию интерфейса `TransportRepository`.
