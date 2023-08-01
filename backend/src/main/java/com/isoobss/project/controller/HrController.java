package com.isoobss.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isoobss.project.request.CreateOpeningRequest;
import com.isoobss.project.service.HrService;
import com.isoobss.project.service.OpeningService;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "http://localhost:3000")
public class HrController {
    private final HrService hrService;
    private final OpeningService openingService;

    @Autowired
    public HrController(HrService hrService, OpeningService openingService) {
        this.hrService = hrService;
        this.openingService = openingService;
    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping
    public String hello(){
        return "Hello";
    }

    @PreAuthorize("hasRole('HR')")
    @GetMapping("/{username}")
    public ResponseEntity<?> getHrId(@PathVariable String username){
        try {
            return ResponseEntity.ok(hrService.getHrByUsername(username).toString());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('HR')")
    @PostMapping("/newOpening")
    public ResponseEntity<?> createOpening(@RequestBody CreateOpeningRequest req){
        try {
            return ResponseEntity.ok(openingService.createOpening(req));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('HR')")
    @DeleteMapping("/opening/{openingId}")
    public ResponseEntity<?> deleteOpening(@PathVariable String openingId){
        try {
            openingService.deleteOpening(openingId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}