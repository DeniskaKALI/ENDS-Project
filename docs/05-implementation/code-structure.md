# Структура кода

```text
backend/
  pom.xml
  docker-compose.yml
  src/main/java/com/progile/backend/
    api/ config/ dto/ model/ repository/ security/ service/
  src/test/java/com/progile/backend/

android/
  app/src/main/java/com/progile/prototype/
    MainActivity.kt
    data/AuthRepository.kt
    data/DemoRepository.kt
    model/Models.kt
    ui/ProgileApp.kt
    ui/ProgileViewModel.kt
    ui/components/
    ui/screens/
    ui/theme/
```

Клиент использует Kotlin, Compose и стандартные Android API. Сервер остаётся самостоятельным Spring Boot-приложением.
