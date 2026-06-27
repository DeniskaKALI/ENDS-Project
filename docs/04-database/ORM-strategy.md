# ORM-стратегия

| Entity | Таблица | Назначение |
|---|---|---|
| `UserAccount` | `user_accounts` | профиль, email, пароль, роль, компания |
| `MonitoredEntity` | `monitored_entities` | универсальная сущность обязательного CRUD API |

Целевое расширение: перенести `TransportDto`, `RouteDto`, `TrackingDto`, `ReportDto`, `CommentDto` в JPA entities, оставить DTO records как внешний контракт и добавить mapper-слой `Entity <-> DTO`.
