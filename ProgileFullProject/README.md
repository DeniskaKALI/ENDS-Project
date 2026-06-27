# Progile

Мобильная система мониторинга транспорта, маршрутов, GPS-состояний и отчётов. Комплект содержит нативный Android-клиент на Kotlin, Spring Boot backend, документацию и готовые сборки.

## Состав проекта

- [`android`](android) — Kotlin, Jetpack Compose, Material 3, MVVM и OpenStreetMap;
- [`backend`](backend) — Java 17, Spring Boot 3, REST API, JWT, PostgreSQL и OpenAPI;
- [`docs`](docs/README.md) — документация по этапам проектирования;
- [`artifacts`](artifacts) — APK, JAR, курсовая работа и листинг backend.

## Быстрый запуск

Готовое приложение: [`artifacts/ProgilePrototype.apk`](artifacts/ProgilePrototype.apk).

Демонстрационная учётная запись:

- email: `deniskaost2005@gmail.com`;
- пароль: `PROass228!`.

Учётная запись открывает весь подготовленный транспорт, маршруты и отчёты. Вкладка **Регистрация** создаёт отдельного локального пользователя.

Запуск из Android Studio:

1. Открыть папку [`android`](android).
2. Выполнить Gradle Sync.
3. Выбрать устройство Android API 26+.
4. Запустить конфигурацию `app`.

## Скриншоты

![Главный экран](docs/images/ui-dashboard.png)

- [Транспорт](docs/images/ui-transport.png)
- [Карточка автомобиля](docs/images/ui-vehicle-detail.png)
- [Маршруты](docs/images/ui-routes.png)
- [Отчёты](docs/images/ui-reports.png)
- [Профиль](docs/images/ui-profile.png)

## Статистика разработки

Метрики рассчитаны по истории Git и текущим исходникам проекта на 27 июня 2026 года.

| Метрика | Значение |
|---|---:|
| Коммиты Git | 1 |
| Автор | 1 |
| Файлы в исходном коммите | 161 |
| Добавленные строки в Git | 25 085 |
| Kotlin-файлы | 19 |
| Строки Kotlin | 2 412 |
| Java-файлы backend | 29 |
| Строки Java backend | 1 123 |
| Тестовые классы backend | 5 |
| REST endpoints | 32 |
| Файлы документации | 205 |

### Активность коммитов

![График активности коммитов](docs/images/commit-activity.png)

### Тепловая карта (Punch Card)

![Punch Card](docs/images/punch-card.png)

## Backend

```powershell
cd backend
docker compose up -d
mvn spring-boot:run
```

Swagger UI: `http://localhost:8080/swagger-ui.html`.

Подробные инструкции находятся в [руководстве пользователя](docs/11-user-guide/user-guide.md), [руководстве администратора](docs/11-user-guide/admin-guide.md) и [разделе развёртывания](docs/10-deployment/README.md).
