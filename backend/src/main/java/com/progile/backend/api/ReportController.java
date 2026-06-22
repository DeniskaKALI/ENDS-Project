package com.progile.backend.api;

import com.progile.backend.dto.ReportDto;
import com.progile.backend.service.DataStore;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final DataStore store;

    public ReportController(DataStore store) {
        this.store = store;
    }

    @PostMapping
    public ReportDto generate(@RequestParam long routeId) {
        return store.generateReport(routeId);
    }

    @GetMapping("/{id}")
    public ReportDto get(@PathVariable long id) {
        return store.getReport(id);
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<String> export(@PathVariable long id, @RequestParam(defaultValue = "csv") String format) {
        var report = store.getReport(id);
        var body = "id;routeId;title;distanceKm;averageSpeed;stops;deviations\n"
                + report.id() + ";" + report.routeId() + ";" + report.title() + ";" + report.distanceKm() + ";"
                + report.averageSpeed() + ";" + report.stops() + ";" + report.deviations();
        var extension = format.equalsIgnoreCase("pdf") ? "txt" : format.toLowerCase();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=progile-report-" + id + "." + extension)
                .contentType(MediaType.TEXT_PLAIN)
                .body(body);
    }
}
