package com.isoobss.project.controller;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.isoobss.project.dto.OpeningDTO;
import com.isoobss.project.model.Application;
import com.isoobss.project.model.Opening;
import com.isoobss.project.request.ApplicationRequest;
import com.isoobss.project.request.CreateOpeningRequest;
import com.isoobss.project.service.OpeningService;

@Controller
@RequestMapping("/api/opening")
@CrossOrigin(origins = "http://localhost:3000")
public class OpeningController {
    private final OpeningService openingService;

    @Autowired
    public OpeningController(OpeningService openingService) {
        this.openingService = openingService;
    }

    @PostMapping()
    public ResponseEntity<OpeningDTO> createOpening(@RequestBody CreateOpeningRequest req) {
        return ResponseEntity.ok(openingService.createOpening(req));
    }

    @GetMapping()
    public ResponseEntity<List<OpeningDTO>> getAllOpenings() {
        return ResponseEntity.ok(openingService.getAllOpenings());
    }

    @GetMapping("/{hrId}")
    public ResponseEntity<List<OpeningDTO>> getOpeningsByHrId(@PathVariable String hrId) {
        return ResponseEntity.ok(openingService.getOpeningsByHrId(hrId));
    }
}
