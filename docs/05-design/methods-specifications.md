# Спецификация ключевых методов

| Метод | Ответственность |
|---|---|
| `UserAccountService.register` | проверяет email, хеширует пароль, сохраняет пользователя, возвращает JWT |
| `UserAccountService.login` | проверяет пароль и генерирует JWT |
| `UserAccountService.changePassword` | проверяет текущий пароль и сохраняет новый BCrypt-хеш |
| `DataStore.updateTransportStatus` | находит ТС, обновляет статус и время изменения |
| `DataStore.generateReport` | создает отчет по маршруту с метриками |
| `ProgileViewModel.loadWithCache` | загружает данные через API, сохраняет кэш или читает его при ошибке сети |
