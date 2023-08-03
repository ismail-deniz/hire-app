package com.isoobss.project.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.isoobss.project.service.ApplicantService;

@RestController
@RequestMapping("/api/applicants")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicantController {
    private final ApplicantService applicantService;

    @Autowired
    public ApplicantController(ApplicantService applicantService) {
        this.applicantService = applicantService;
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllApplicants() {
        return ResponseEntity.ok(applicantService.getAllApplicants());
    }

    @GetMapping
    public ResponseEntity<?> getAllApplicantsOfOpening(@RequestParam String openingId) {
        return ResponseEntity.ok(applicantService.getAllApplicantsOfOpening(new ObjectId(openingId)));
    }
}
