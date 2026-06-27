package com.progile.backend.service;

import com.progile.backend.dto.CommentDto;
import com.progile.backend.dto.ReportDto;
import com.progile.backend.dto.RouteDto;
import com.progile.backend.dto.TrackingDto;
import com.progile.backend.dto.TransportDto;
import com.progile.backend.model.RoleName;
import com.progile.backend.model.RouteStatus;
import com.progile.backend.model.UserAccount;
import com.progile.backend.model.VehicleStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class DataStore {
    private final AtomicLong userSeq = new AtomicLong(1);
    private final AtomicLong transportSeq = new AtomicLong(4);
    private final AtomicLong routeSeq = new AtomicLong(4);
    private final AtomicLong trackingSeq = new AtomicLong(1);
    private final AtomicLong reportSeq = new AtomicLong(1);
    private final AtomicLong commentSeq = new AtomicLong(1);

    private final Map<String, UserAccount> usersByEmail = new ConcurrentHashMap<>();
    private final Map<Long, TransportDto> transports = new ConcurrentHashMap<>();
    private final Map<Long, RouteDto> routes = new ConcurrentHashMap<>();
    private final Map<Long, TrackingDto> tracking = new ConcurrentHashMap<>();
    private final Map<Long, ReportDto> reports = new ConcurrentHashMap<>();
    private final Map<Long, CommentDto> comments = new ConcurrentHashMap<>();

    public DataStore() {
        var encoder = new BCryptPasswordEncoder();
        createUser("Иванов Иван Иванович", "dispatcher@progile.ru", encoder.encode("demo123"), RoleName.DISPATCHER, "ООО \"Прогайл Логистика\"");

        transports.put(1L, new TransportDto(1L, "А123ВС", "КАМАЗ 5320", "Иванов И.И.", "Грузовой", VehicleStatus.MOVING, 72, 75, "2 мин назад"));
        transports.put(2L, new TransportDto(2L, "К456МН", "МАЗ 6303", "Петров П.П.", "Тягач", VehicleStatus.OFF_ROUTE, 45, 58, "5 мин назад"));
        transports.put(3L, new TransportDto(3L, "Т789ОР", "Volvo FH16", "Сидоров С.С.", "Фура", VehicleStatus.STOPPED, 0, 42, "12 мин назад"));

        routes.put(1L, new RouteDto(1L, "Москва - Санкт-Петербург", "Москва, ул. Складская 15", "Санкт-Петербург, пр. Индустриальный 42", RouteStatus.ACTIVE, 1L, "18:30", 65));
        routes.put(2L, new RouteDto(2L, "Самара - Уфа", "Самара, Логопарк", "Уфа, ул. Транспортная 12", RouteStatus.ACTIVE, 2L, "16:45", 78));
        routes.put(3L, new RouteDto(3L, "Екатеринбург - Челябинск", "Екатеринбург, Складской комплекс", "Челябинск, ул. Промышленная 8", RouteStatus.PLANNED, null, "Завтра 09:00", 0));
    }

    public Optional<UserAccount> findUser(String email) {
        return Optional.ofNullable(usersByEmail.get(email.toLowerCase(Locale.ROOT)));
    }

    public UserAccount createUser(String fullName, String email, String passwordHash, RoleName role, String company) {
        var normalized = email.toLowerCase(Locale.ROOT);
        if (usersByEmail.containsKey(normalized)) {
            throw new ResponseStatusException(CONFLICT, "User already exists");
        }
        var account = new UserAccount(userSeq.getAndIncrement(), normalized, passwordHash, fullName, role, company);
        usersByEmail.put(normalized, account);
        return account;
    }

    public List<TransportDto> listTransports() {
        return sorted(transports.values());
    }

    public TransportDto getTransport(long id) {
        return Optional.ofNullable(transports.get(id)).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Transport not found"));
    }

    public List<TransportDto> searchTransport(String query) {
        var normalized = query.toLowerCase(Locale.ROOT);
        return listTransports().stream()
                .filter(item -> item.plateNumber().toLowerCase(Locale.ROOT).contains(normalized)
                        || item.model().toLowerCase(Locale.ROOT).contains(normalized)
                        || item.driver().toLowerCase(Locale.ROOT).contains(normalized))
                .toList();
    }

    public TransportDto createTransport(TransportDto request) {
        var id = transportSeq.getAndIncrement();
        var created = new TransportDto(id, request.plateNumber(), request.model(), request.driver(), request.type(), request.status(), request.speed(), request.fuel(), "только что");
        transports.put(id, created);
        return created;
    }

    public TransportDto updateTransport(long id, TransportDto request) {
        getTransport(id);
        var updated = new TransportDto(id, request.plateNumber(), request.model(), request.driver(), request.type(), request.status(), request.speed(), request.fuel(), "только что");
        transports.put(id, updated);
        return updated;
    }

    public TransportDto updateTransportStatus(long id, VehicleStatus status) {
        var current = getTransport(id);
        var speed = status == VehicleStatus.MOVING ? Math.max(current.speed(), 45) : 0;
        var updated = new TransportDto(id, current.plateNumber(), current.model(), current.driver(), current.type(), status, speed, current.fuel(), "только что");
        transports.put(id, updated);
        return updated;
    }

    public void deleteTransport(long id) {
        getTransport(id);
        transports.remove(id);
    }

    public List<RouteDto> listRoutes() {
        return sorted(routes.values());
    }

    public RouteDto getRoute(long id) {
        return Optional.ofNullable(routes.get(id)).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Route not found"));
    }

    public RouteDto createRoute(RouteDto request) {
        var id = routeSeq.getAndIncrement();
        var created = new RouteDto(id, request.name(), request.startPoint(), request.endPoint(), request.status(), request.vehicleId(), request.eta(), request.progress());
        routes.put(id, created);
        return created;
    }

    public RouteDto updateRoute(long id, RouteDto request) {
        getRoute(id);
        var updated = new RouteDto(id, request.name(), request.startPoint(), request.endPoint(), request.status(), request.vehicleId(), request.eta(), request.progress());
        routes.put(id, updated);
        return updated;
    }

    public RouteDto updateRouteStatus(long id, RouteStatus status) {
        var current = getRoute(id);
        var progress = status == RouteStatus.COMPLETED ? 100 : current.progress();
        var updated = new RouteDto(id, current.name(), current.startPoint(), current.endPoint(), status, current.vehicleId(), current.eta(), progress);
        routes.put(id, updated);
        return updated;
    }

    public void deleteRoute(long id) {
        getRoute(id);
        routes.remove(id);
    }

    public TrackingDto createTracking(TrackingDto request) {
        getTransport(request.transportId());
        var id = trackingSeq.getAndIncrement();
        var snapshot = new TrackingDto(id, request.transportId(), request.routeId(), request.latitude(), request.longitude(), request.speed(), Instant.now());
        tracking.put(id, snapshot);
        updateTransportStatus(request.transportId(), request.speed() > 0 ? VehicleStatus.MOVING : VehicleStatus.STOPPED);
        return snapshot;
    }

    public TrackingDto currentLocation(long transportId) {
        getTransport(transportId);
        return tracking.values().stream()
                .filter(item -> item.transportId().equals(transportId))
                .max(Comparator.comparing(TrackingDto::timestamp))
                .orElse(new TrackingDto(0L, transportId, null, 55.7558, 37.6173, getTransport(transportId).speed(), Instant.now()));
    }

    public ReportDto generateReport(long routeId) {
        var route = getRoute(routeId);
        var report = new ReportDto(reportSeq.getAndIncrement(), route.id(), "Отчёт по маршруту " + route.name(), 420, 68, 3, route.status() == RouteStatus.ACTIVE ? 1 : 0, Instant.now());
        reports.put(report.id(), report);
        return report;
    }

    public ReportDto getReport(long id) {
        return Optional.ofNullable(reports.get(id)).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Report not found"));
    }

    public CommentDto addComment(CommentDto request, String author) {
        var comment = new CommentDto(commentSeq.getAndIncrement(), request.transportId(), request.routeId(), request.text(), author, Instant.now());
        comments.put(comment.id(), comment);
        return comment;
    }

    public List<CommentDto> listComments(Long transportId, Long routeId) {
        return comments.values().stream()
                .filter(item -> transportId == null || transportId.equals(item.transportId()))
                .filter(item -> routeId == null || routeId.equals(item.routeId()))
                .sorted(Comparator.comparing(CommentDto::createdAt))
                .toList();
    }

    private static <T extends Record> List<T> sorted(Iterable<T> values) {
        var result = new ArrayList<T>();
        values.forEach(result::add);
        return result;
    }
}
