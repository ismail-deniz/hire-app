package com.isoobss.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.isoobss.project.exception.LinkedinException;
import com.isoobss.project.model.LinkedinProfile;
import com.isoobss.project.service.LinkedinService;

@RestController
@RequestMapping("/api/linkedin")
@CrossOrigin(origins = "http://localhost:3000")
public class LinkedinController {

    private final LinkedinService linkedinService;

    @Autowired
    public LinkedinController(LinkedinService linkedinService) {
        this.linkedinService = linkedinService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getLinkedinProfile(@RequestParam("code") String authorizationCode) {
        try {
            LinkedinProfile profile = linkedinService.getLinkedinProfile(authorizationCode);
            return ResponseEntity.ok(profile);
        } catch (LinkedinException e) {
            return ResponseEntity.badRequest().body("Failed to fetch Linkedin profile: " + e.getMessage());
        }
    }
}
