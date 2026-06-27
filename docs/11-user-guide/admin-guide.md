# Руководство администратора

## Роли

| Роль | Права |
|---|---|
| `ADMIN` | полный доступ и управление учётными записями |
| `DISPATCHER` | мониторинг транспорта и статусов |
| `LOGIST` | создание и изменение маршрутов |
| `MANAGER` | просмотр отчётов и показателей |
| `DRIVER` | просмотр назначенного маршрута |
| `USER` | базовый доступ |

Перечисление ролей находится в [`RoleName.java`](../../backend/src/main/java/com/progile/backend/model/RoleName.java).

## Запуск инфраструктуры

```powershell
cd backend
docker compose up -d
mvn spring-boot:run
```

PostgreSQL работает на порту `5432`, backend — на `8080`. Swagger UI: `http://localhost:8080/swagger-ui.html`.

## Безопасность

- пароли серверных пользователей хранятся как BCrypt-хеши;
- JWT передаётся в заголовке `Authorization: Bearer <token>`;
- публичными являются endpoints регистрации и входа;
- остальные endpoints защищены Spring Security;
- CORS и правила доступа определены в [`SecurityConfig.java`](../../backend/src/main/java/com/progile/backend/config/SecurityConfig.java).

## Сборка

```powershell
cd backend
mvn clean verify
java -jar target\progile-backend-1.0.0.jar
```

Готовый серверный файл находится в [`artifacts/progile-backend-1.0.0.jar`](../../artifacts/progile-backend-1.0.0.jar).

## Проверка

1. Открыть Swagger UI.
2. Выполнить `POST /api/auth/register`.
3. Выполнить `POST /api/auth/login` и получить JWT.
4. Нажать **Authorize** и указать токен.
5. Проверить `/api/entities`, `/api/transport`, `/api/routes`, `/api/tracking` и `/api/reports`.
