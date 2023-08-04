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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isoobss.project.request.CreateOpeningRequest;
import com.isoobss.project.request.EditOpeningRequest;
import com.isoobss.project.service.ApplicantService;
import com.isoobss.project.service.ApplicationService;
import com.isoobss.project.service.HrService;
import com.isoobss.project.service.OpeningService;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "http://localhost:3000")
public class HrController {
    private final HrService hrService;
    private final OpeningService openingService;
    private final ApplicationService applicationService;
    private final ApplicantService applicantService;

    @Autowired
    public HrController(HrService hrService, OpeningService openingService, ApplicationService applicationService, ApplicantService applicantService) {
        this.hrService = hrService;
        this.openingService = openingService;
        this.applicationService = applicationService;
        this.applicantService = applicantService;
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

    @PreAuthorize("hasRole('HR')")
    @PutMapping("/opening")
    public ResponseEntity<?> updateOpening(@RequestBody EditOpeningRequest req){
        try {
            return ResponseEntity.ok(openingService.editOpening(req));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('HR')")
    @PutMapping("/accept/{openingId}/{applicantId}")
    public ResponseEntity<?> acceptApplicant(@PathVariable String openingId, @PathVariable String applicantId){
        try {
            return ResponseEntity.ok(applicationService.acceptApplicant(openingId, applicantId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('HR')")
    @PutMapping("/process/{openingId}/{applicantId}")
    public ResponseEntity<?> processApplicant(@PathVariable String openingId, @PathVariable String applicantId){
        try {
            return ResponseEntity.ok(applicationService.processApplicant(openingId, applicantId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('HR')")
    @PutMapping("/decline/{openingId}/{applicantId}")
    public ResponseEntity<?> declineApplicant(@PathVariable String openingId, @PathVariable String applicantId){
        try {
            return ResponseEntity.ok(applicationService.declineApplicant(openingId, applicantId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('HR')")
    @PutMapping("/blacklist/{applicantId}")
    public ResponseEntity<?> blakclistApplicant(@PathVariable String applicantId){
        try {
            return ResponseEntity.ok(applicantService.blacklistApplicant(applicantId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
