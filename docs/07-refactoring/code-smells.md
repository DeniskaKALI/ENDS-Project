# Code smells и направления улучшения

| Риск | Где возникает | Решение |
|---|---|---|
| Рост `DataStore` | backend-сценарии | выделить `TransportService`, `RouteService`, `ReportService` |
| Дублирование mapping | DTO и JPA | добавить mapper-классы |
| Жёсткие demo-данные | `DemoTransportRepository` | подключить сетевую реализацию `TransportRepository` |
| Локальная auth вместо JWT | Android-прототип | заменить `LocalAuthRepository` на backend auth adapter |
| Жизненный цикл WebView | карта | уничтожать WebView в `DisposableEffect` |
| Строковые статусы | обмен между слоями | использовать enum на Java и Kotlin |
