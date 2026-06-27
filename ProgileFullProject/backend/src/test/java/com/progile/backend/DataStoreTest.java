package com.progile.backend;

import com.progile.backend.dto.RouteDto;
import com.progile.backend.dto.TransportDto;
import com.progile.backend.model.RouteStatus;
import com.progile.backend.model.VehicleStatus;
import com.progile.backend.service.DataStore;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DataStoreTest {
    private final DataStore store = new DataStore();

    @Test
    void createsAndSearchesTransport() {
        var created = store.createTransport(new TransportDto(
                null,
                "Н999ТТ",
                "ГАЗон Next",
                "Смирнов С.С.",
                "Грузовой",
                VehicleStatus.MOVING,
                55,
                80,
                null
        ));

        assertThat(created.id()).isNotNull();
        assertThat(store.searchTransport("газон")).extracting(TransportDto::plateNumber).contains("Н999ТТ");
    }

    @Test
    void updatesRouteStatusToCompletedProgress() {
        var route = store.createRoute(new RouteDto(
                null,
                "Тестовый маршрут",
                "Склад",
                "Терминал",
                RouteStatus.ACTIVE,
                1L,
                "18:00",
                40
        ));

        var completed = store.updateRouteStatus(route.id(), RouteStatus.COMPLETED);

        assertThat(completed.status()).isEqualTo(RouteStatus.COMPLETED);
        assertThat(completed.progress()).isEqualTo(100);
    }

    @Test
    void generatesReportForRoute() {
        var report = store.generateReport(1L);

        assertThat(report.id()).isNotNull();
        assertThat(report.routeId()).isEqualTo(1L);
        assertThat(report.averageSpeed()).isGreaterThan(0);
    }
}
