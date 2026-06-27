# Интерфейсы

| Интерфейс | Протокол | Формат | Назначение |
|---|---|---|---|
| Auth API | HTTP/HTTPS | JSON | регистрация, вход, профиль |
| Entities API | HTTP/HTTPS | JSON | обязательный CRUD КП |
| Transport API | HTTP/HTTPS | JSON | транспорт и статусы |
| Routes API | HTTP/HTTPS | JSON | маршруты и прогресс |
| Tracking API | HTTP/HTTPS | JSON | GPS-снимки |
| Reports API | HTTP/HTTPS | JSON | отчеты и экспорт |
| Comments API | HTTP/HTTPS | JSON | комментарии |

Backend использует `Authorization: Bearer <jwt>` и BCrypt. Android-прототип использует локальную регистрацию с salted SHA-256 и сохраняет сессию в SharedPreferences. Карта имеет Canvas-fallback при ошибке сети.
