package com.isoobss.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isoobss.project.model.Application;
import com.isoobss.project.request.ApplicationRequest;
import com.isoobss.project.service.ApplicationService;

@RestController
@RequestMapping("/api/application")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {
    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping("/{applicantId}")
    public ResponseEntity<?> getAllApplicationsByApplicantId(@PathVariable String applicantId) {
        try {
            return ResponseEntity.ok(applicationService.getAllApplicationsByApplicantId(applicantId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{openingId}/{applicantId}")
    public ResponseEntity<?> getApplications(@PathVariable String openingId, @PathVariable String applicantId) {
        try {
            return ResponseEntity.ok(applicationService.getApplication(openingId, applicantId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> applyToOpening(@RequestBody ApplicationRequest req) {
        try{
            Application application = applicationService.applyToOpening(req);
            if (application != null) {
                return ResponseEntity.ok(application);
            } else {
                return ResponseEntity.badRequest().body("Applicant or opening cannot be found!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
