# Progile Mobile Coursework

Курсовой комплект для траектории "Мобильная разработка": мобильное приложение React Native/Expo и сервер Java Spring Boot.

## Структура

- `mobile/` - мобильное приложение с 8 экранами, Material Design 3, навигацией, JWT-клиентом и оффлайн-кэшем.
- `backend/` - Java Spring Boot REST API с PostgreSQL, JWT-безопасностью, ролями, тестами и OpenAPI/Swagger.
- `Logisticsmobileappdesign-main/` - исходный web-preview макета из архива, сохранён как визуальный референс.

## Соответствие критериям

| Критерий | Вес | Где реализовано |
| --- | ---: | --- |
| Мобильный UI: 5+ экранов, навигация, Material Design | 10% | `mobile/App.tsx`, `mobile/src/screens/*`, React Navigation + React Native Paper MD3 |
| Серверная часть: Java + Spring Boot, качество кода | 8% | `backend/pom.xml`, слои `api`, `service`, `security`, `dto`, `model`, `config` |
| REST API: 8+ эндпоинтов, OpenAPI | 5% | Обязательные `/api/entities...` + расширенные endpoints, Swagger `/swagger-ui.html` |
| JWT-безопасность: аутентификация, роли | 3% | `security/*`, BCrypt, роли `USER` и `ADMIN` + логистические роли |
| Оффлайн-режим: кэширование, работа без интернета | 4% | `mobile/src/state/AppProvider.tsx`, SecureStore + AsyncStorage + NetInfo |
| PostgreSQL и тесты >40% | из требований | `backend/docker-compose.yml`, JPA repository, JaCoCo threshold `0.40` |

## Быстрый запуск

### Backend

```bash
cd backend
docker compose up -d
mvn spring-boot:run
```

После запуска:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Demo login: `dispatcher@progile.ru`
- Demo password: `demo123`

Dev HTTPS для демонстрации:

```powershell
cd backend
powershell -ExecutionPolicy Bypass -File .\scripts\generate-dev-keystore.ps1
$env:SSL_ENABLED="true"
$env:SSL_KEY_STORE="file:./dev-keystore.p12"
$env:SSL_KEY_STORE_PASSWORD="changeit"
$env:SERVER_PORT="8443"
mvn spring-boot:run
```

Сборка JAR/WAR:

```bash
cd backend
mvn clean package
java -jar target/progile-backend-1.0.0.jar
```

Тесты и покрытие:

```bash
cd backend
mvn verify
```

### Mobile

```bash
cd mobile
pnpm install
pnpm start
```

Для Android emulator API URL уже настроен как `http://10.0.2.2:8080/api`.
Для физического телефона замени `API_URL` в `mobile/src/api/client.ts` на IP компьютера в локальной сети.

APK через EAS:

```bash
cd mobile
pnpm dlx eas-cli build -p android --profile preview
```

Локальная Android-сборка после prebuild:

```bash
cd mobile
pnpm dlx expo prebuild -p android
cd android
gradlew assembleRelease
```

## REST API

Минимальный набор endpoints уже превышает требуемые 8:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`
- `DELETE /api/auth/profile`
- `GET /api/transport`
- `GET /api/transport/{id}`
- `GET /api/transport/search`
- `POST /api/transport`
- `PUT /api/transport/{id}`
- `PATCH /api/transport/{id}/status`
- `DELETE /api/transport/{id}`
- `GET /api/routes`
- `GET /api/routes/{id}`
- `POST /api/routes`
- `PUT /api/routes/{id}`
- `PATCH /api/routes/{id}/status`
- `DELETE /api/routes/{id}`
- `GET /api/tracking/current`
- `POST /api/tracking`
- `POST /api/reports`
- `GET /api/reports/{id}`
- `GET /api/reports/{id}/export`
- `GET /api/comments`
- `POST /api/comments`

Обязательные endpoints из методички реализованы отдельно:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/entities`
- `GET /api/entities/{id}`
- `POST /api/entities`
- `PUT /api/entities/{id}`
- `DELETE /api/entities/{id}`
- `GET /api/entities/search`

