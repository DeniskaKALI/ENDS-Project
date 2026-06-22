# Progile Mobile

React Native/Expo мобильное приложение для курсового проекта по мониторингу транспорта.

## Реализовано

- 8 экранов: вход, главная, транспорт, детали ТС, маршруты, детали маршрута, отчёты, профиль.
- Нижняя навигация через React Navigation.
- Material Design 3 через React Native Paper.
- JWT-клиент для Spring Boot backend.
- Безопасное хранение JWT через Expo SecureStore.
- Оффлайн-кэш через AsyncStorage.
- Определение сети через NetInfo.
- CRUD для транспорта и маршрутов.
- Работа без backend в demo/offline fallback режиме.

## Запуск

```bash
pnpm install
pnpm start
```

Backend URL находится в `src/api/client.ts`.

Для Android emulator используй:

```ts
export const API_URL = "http://10.0.2.2:8080/api";
```

Для физического телефона укажи IP компьютера, например:

```ts
export const API_URL = "http://192.168.1.10:8080/api";
```

Если backend запущен в dev HTTPS-режиме, поменяй порт и протокол на `https://...:8443/api`. Для self-signed сертификата на эмуляторе может потребоваться доверить сертификат вручную.

## APK

Через EAS:

```bash
pnpm dlx eas-cli build -p android --profile preview
```

Локально через Android Studio/Gradle:

```bash
pnpm dlx expo prebuild -p android
```

После этого открой папку `mobile/android` в Android Studio или выполни:

```bash
cd android
gradlew assembleRelease
```
