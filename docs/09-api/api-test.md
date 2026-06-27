# API test guide

## Запуск backend

```bash
cd backend
docker compose up -d
mvn spring-boot:run
```

## Регистрация

```bash
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"fullName\":\"Test Dispatcher\",\"email\":\"test@progile.ru\",\"password\":\"demo123\",\"role\":\"DISPATCHER\",\"company\":\"Progile\"}"
```

## Вход

```bash
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@progile.ru\",\"password\":\"demo123\"}"
```

После входа передавай `Authorization: Bearer <token>`.

Минимальный набор проверки: `/api/auth/login`, `/api/auth/register`, `/api/entities`, `/api/entities/{id}`, `/api/entities/search`, `/api/transport`, `/api/routes`, `/api/tracking/current`, `/api/reports`, `/api/comments`.
