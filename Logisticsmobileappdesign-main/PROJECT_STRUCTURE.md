# Progile Mobile - Структура проекта

## 📁 Организация файлов

```
src/app/
├── App.tsx                          # Главный компонент приложения
├── components/                      # Компоненты
│   ├── figma/                      # Figma специфичные компоненты
│   │   └── ImageWithFallback.tsx
│   ├── progile/                    # Компоненты Progile
│   │   ├── AlertCard.tsx          # Карточка уведомления
│   │   ├── AppBar.tsx             # Верхняя панель
│   │   ├── BottomNav.tsx          # Нижняя навигация
│   │   ├── ChartCard.tsx          # Карточка графика
│   │   ├── EmptyState.tsx         # Пустое состояние
│   │   ├── KPIWidget.tsx          # Виджет KPI метрики
│   │   ├── LiveIndicator.tsx      # LIVE индикатор
│   │   ├── LoadingSkeleton.tsx    # Скелетоны загрузки
│   │   ├── MapWidget.tsx          # Виджет карты
│   │   ├── NotificationCenter.tsx # Центр уведомлений
│   │   ├── OfflineIndicator.tsx   # Индикатор офлайн режима
│   │   ├── QuickStats.tsx         # Быстрая статистика
│   │   ├── RouteCard.tsx          # Карточка маршрута
│   │   ├── SearchBar.tsx          # Строка поиска
│   │   ├── StatusBadge.tsx        # Бейдж статуса
│   │   ├── TransportCard.tsx      # Карточка транспорта
│   │   └── index.ts               # Экспорты
│   └── ui/                         # shadcn/ui компоненты
│       └── [50+ UI компонентов]
├── data/                           # Данные
│   └── mockData.ts                # Мок данные
├── hooks/                          # React хуки
│   └── useOnlineStatus.ts         # Хук статуса подключения
├── lib/                            # Утилиты
│   ├── constants.ts               # Константы
│   └── utils/
│       ├── formatters.ts          # Форматтеры
│       └── index.ts
├── screens/                        # Экраны приложения
│   ├── DashboardScreen.tsx        # Главный экран
│   ├── ProfileScreen.tsx          # Профиль
│   ├── ReportsScreen.tsx          # Отчёты
│   ├── RouteDetailScreen.tsx      # Детали маршрута
│   ├── RoutesScreen.tsx           # Список маршрутов
│   ├── TransportDetailScreen.tsx  # Детали транспорта
│   └── TransportScreen.tsx        # Список транспорта
└── types/                          # TypeScript типы
    └── index.ts                   # Определения типов
```

## 🎯 Основные компоненты

### Экраны (Screens)

1. **DashboardScreen** - Главный экран с KPI метриками, картой и уведомлениями
2. **TransportScreen** - Список транспорта с поиском и фильтрацией
3. **TransportDetailScreen** - Детальная информация о транспорте
4. **RoutesScreen** - Список маршрутов с табами
5. **RouteDetailScreen** - Детальная информация о маршруте
6. **ReportsScreen** - Аналитика и отчёты
7. **ProfileScreen** - Профиль пользователя и настройки

### Компоненты UI (Progile)

#### Карточки
- `TransportCard` - Отображение транспорта
- `RouteCard` - Отображение маршрута
- `AlertCard` - Уведомления
- `KPIWidget` - KPI метрики

#### Навигация
- `BottomNav` - Нижняя панель навигации
- `AppBar` - Верхняя панель с уведомлениями
- `NotificationCenter` - Модальный центр уведомлений

#### Виджеты
- `MapWidget` - Интерактивная карта
- `ChartCard` - Графики
- `QuickStats` - Быстрая статистика
- `LiveIndicator` - LIVE индикатор
- `StatusBadge` - Бейдж статуса

#### Утилиты
- `SearchBar` - Строка поиска
- `EmptyState` - Пустое состояние
- `LoadingSkeleton` - Скелетоны загрузки
- `OfflineIndicator` - Индикатор офлайн

## 🔧 Утилиты и хуки

### Hooks
- `useOnlineStatus` - Отслеживание статуса интернет-соединения

### Utils
- `formatters.ts` - Функции форматирования (расстояние, скорость, время и т.д.)

### Constants
- `constants.ts` - Цвета, статусы, конфигурация

### Types
- `index.ts` - TypeScript типы для всего приложения

## 🎨 Дизайн система

### Цвета
```typescript
PRIMARY: #4DA6FF      // Основной синий
PRIMARY_LIGHT: #DDEFFF // Светло-синий
BACKGROUND: #F8FBFF    // Фон
SUCCESS: #22C55E       // Успех
WARNING: #F59E0B       // Предупреждение
DANGER: #EF4444        // Опасность
```

### Радиусы скругления
- Cards: 20px
- Buttons: 16px
- Inputs: 12px
- Badges: 24px (pill)

### Тени
- Small: 0 1px 3px rgba(0,0,0,0.08)
- Medium: 0 4px 6px rgba(0,0,0,0.1)
- Large: 0 10px 15px rgba(0,0,0,0.1)

## 🚀 Навигация

Приложение использует state-based навигацию:

```typescript
type Screen =
  | { type: "dashboard" }
  | { type: "transport" }
  | { type: "transport-detail"; id: string }
  | { type: "routes" }
  | { type: "route-detail"; id: string }
  | { type: "reports" }
  | { type: "profile" };
```

## 📊 Данные

Все данные находятся в `src/app/data/mockData.ts`:
- `MOCK_VEHICLES` - Транспорт
- `MOCK_ROUTES` - Маршруты
- `MOCK_ALERTS` - Уведомления

## 🔄 Состояния

### Статусы транспорта
- MOVING - В движении
- STOPPED - Остановка
- OFF_ROUTE - Вне маршрута
- MAINTENANCE - Техобслуживание

### Статусы маршрутов
- PLANNED - Запланирован
- ACTIVE - Активный
- COMPLETED - Завершён

### Типы уведомлений
- gps_lost - Потеря GPS
- speed_violation - Превышение скорости
- route_deviation - Отклонение от маршрута
- long_stop - Длительная остановка
