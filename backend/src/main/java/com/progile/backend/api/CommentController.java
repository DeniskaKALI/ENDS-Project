package com.progile.backend.api;

import com.progile.backend.dto.CommentDto;
import com.progile.backend.service.DataStore;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final DataStore store;

    public CommentController(DataStore store) {
        this.store = store;
    }

    @GetMapping
    public List<CommentDto> list(@RequestParam(required = false) Long transportId, @RequestParam(required = false) Long routeId) {
        return store.listComments(transportId, routeId);
    }

    @PostMapping
    public CommentDto add(@Valid @RequestBody CommentDto request, Authentication authentication) {
        return store.addComment(request, authentication.getName());
    }
}
