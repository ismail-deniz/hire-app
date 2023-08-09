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
        try {
            return ResponseEntity.ok(openingService.createOpening(req));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping()
    public ResponseEntity<List<OpeningDTO>> getAllOpenings() {
        try {
            return ResponseEntity.ok(openingService.getAllOpenings());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{hrId}")
    public ResponseEntity<List<OpeningDTO>> getOpeningsByHrId(@PathVariable String hrId) {
        try {
            return ResponseEntity.ok(openingService.getOpeningsByHrId(hrId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
