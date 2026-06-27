# План тестирования

| Группа | Проверки | Инструменты |
|---|---|---|
| Backend unit | JWT, хранилище, сервис пользователей | JUnit, AssertJ |
| Backend API | auth, entities, защищённые endpoints | MockMvc |
| Security | регистрация, вход, отказ без токена | Spring Security Test |
| Android build | компиляция Kotlin и ресурсов | Gradle `assembleDebug` |
| Android UI | вход, регистрация, навигация, карта, fallback | Android Emulator |

```powershell
cd backend
mvn verify

cd ..\android
.\gradlew.bat :app:assembleDebug
```

Критерии приёмки: backend-тесты проходят, покрытие JaCoCo не ниже 40%, APK собирается, демонстрационная учётная запись получает транспорт и маршруты, новый пользователь видит отдельный пустой профиль, карта имеет офлайн-заглушку.
