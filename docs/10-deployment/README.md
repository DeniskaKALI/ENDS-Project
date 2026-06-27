# 10. Развёртывание

## Backend

Для PostgreSQL:

```powershell
cd backend
docker compose up -d
mvn spring-boot:run
```

Swagger UI доступен по адресу `http://localhost:8080/swagger-ui.html`.

Сборка и запуск JAR:

```powershell
cd backend
mvn clean package
java -jar target\progile-backend-1.0.0.jar
```

Готовый JAR также находится в `artifacts/progile-backend-1.0.0.jar`.

## Android

1. Открыть папку `android` в Android Studio.
2. Дождаться Gradle Sync.
3. Выбрать устройство API 26+.
4. Нажать **Run app**.

Командная сборка:

```powershell
cd android
.\gradlew.bat :app:assembleDebug
```

Результат: `android/app/build/outputs/apk/debug/app-debug.apk`. Готовый проверенный APK расположен в `artifacts/ProgilePrototype.apk`.

Прототип не требует backend для демонстрации. OpenStreetMap использует интернет; без сети показывается локальная схема.
