# Data Mapper

DTO records отделяют внешний JSON-контракт от внутренних моделей. При переводе транспорта и маршрутов из `DataStore` в JPA стоит добавить:

| Mapper | Ответственность |
|---|---|
| `TransportMapper` | `TransportEntity <-> TransportDto` |
| `RouteMapper` | `RouteEntity <-> RouteDto` |
| `TrackingMapper` | `TrackingSnapshotEntity <-> TrackingDto` |
| `ReportMapper` | `ReportEntity <-> ReportDto` |
| `CommentMapper` | `CommentEntity <-> CommentDto` |
