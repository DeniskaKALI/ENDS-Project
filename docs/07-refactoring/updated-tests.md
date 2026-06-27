# Обновлённые проверки

```powershell
cd backend
mvn verify

cd ..\android
.\gradlew.bat :app:assembleDebug
```

Backend проверяет регистрацию, повторный email, JWT, профиль, смену пароля, CRUD `/api/entities` и операции `DataStore`. Android-прототип проверен сборкой debug APK и запуском экранов авторизации, транспорта, маршрутов, отчётов и профиля на эмуляторе.
