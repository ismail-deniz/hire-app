package com.isoobss.project.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.isoobss.project.exception.LinkedinException;
import com.isoobss.project.exception.UserNotFoundException;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.request.ScrapeLinkedinProfileRequest;
import com.isoobss.project.service.LinkedinService;
import com.isoobss.project.service.ScrapeService;

@RestController
@RequestMapping("/api/linkedin")
@CrossOrigin(origins = "http://localhost:3000")
public class LinkedinController {

    private final LinkedinService linkedinService;
    private final ScrapeService scrapeService;

    @Autowired
    public LinkedinController(LinkedinService linkedinService, ScrapeService scrapeService) {
        this.linkedinService = linkedinService;
        this.scrapeService = scrapeService;
    }


    @GetMapping("/profile")
    public ResponseEntity<?> getLinkedinProfile(@RequestParam("code") String authorizationCode) {
        try {
            Applicant profile = linkedinService.getLinkedinProfile(authorizationCode);
            return ResponseEntity.ok(profile);
        } catch (LinkedinException e) {
            return ResponseEntity.badRequest().body("Failed to fetch Linkedin profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile/{urlAppendix}") 
    public ResponseEntity<?> scrapeLinkedinProfile(@PathVariable String urlAppendix, @RequestBody ScrapeLinkedinProfileRequest req) {
        try {
            Applicant profile = scrapeService.scrapeProfile("https://www.linkedin.com/in/" + urlAppendix, req.getEmail());
            return ResponseEntity.ok(profile);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }
}
