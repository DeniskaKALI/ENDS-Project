# JaCoCo report

Backend настроен на проверку минимального покрытия 40% через Maven/JaCoCo.

| Тест | Назначение |
|---|---|
| `AuthControllerTest` | регистрация, вход, профильные endpoints |
| `EntityControllerTest` | обязательный CRUD `/api/entities` |
| `DataStoreTest` | операции транспорта/маршрутов |
| `JwtServiceTest` | генерация и чтение JWT |
| `UserAccountServiceTest` | BCrypt, профиль, смена пароля |

Отчет создается в `backend/target/site/jacoco/` после `mvn verify`.
