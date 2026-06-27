# Progile Backend

Spring Boot сервер для мобильного приложения мониторинга транспорта.

## Возможности

- JWT-аутентификация.
- Роли: `USER`, `DISPATCHER`, `LOGIST`, `ADMIN`, `MANAGER`, `DRIVER`.
- PostgreSQL через Spring Data JPA.
- REST API для транспорта, маршрутов, GPS-трекинга, отчётов и комментариев.
- Обязательные CRUD endpoints `/api/entities`.
- Профильные endpoints `/api/auth/me`, `/api/auth/profile`, `/api/auth/change-password`.
- OpenAPI/Swagger документация.
- BCrypt-хеширование паролей.
- JaCoCo-порог покрытия: 40%.

## Запуск

```bash
docker compose up -d
mvn spring-boot:run
```

Swagger: `http://localhost:8080/swagger-ui.html`

Dev HTTPS можно включить для демонстрации:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\generate-dev-keystore.ps1
$env:SSL_ENABLED="true"
$env:SSL_KEY_STORE="file:./dev-keystore.p12"
$env:SSL_KEY_STORE_PASSWORD="changeit"
$env:SERVER_PORT="8443"
mvn spring-boot:run
```

После этого Swagger будет доступен по адресу `https://localhost:8443/swagger-ui.html`.

Демо-пользователь:

- email: `dispatcher@progile.ru`
- password: `demo123`

## Тесты и сборка

```bash
mvn verify
mvn clean package
java -jar target/progile-backend-1.0.0.jar
```

## PostgreSQL

По умолчанию приложение ждёт:

- URL: `jdbc:postgresql://localhost:5432/progile`
- user: `progile`
- password: `progile`

Можно переопределить переменными окружения:

```bash
DB_URL=jdbc:postgresql://localhost:5432/progile
DB_USERNAME=progile
DB_PASSWORD=progile
```

## Архитектура

- `api` - REST controllers.
- `service` - бизнес-логика и in-memory хранилище.
- `security` - JWT generation/parsing и authentication filter.
- `config` - Spring Security и OpenAPI.
- `dto` - request/response контракты с validation.
- `model` - роли и статусы предметной области.
- `repository` - JPA repository для PostgreSQL.
