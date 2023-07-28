package com.isoobss.project.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.isoobss.project.model.Applicant;
import com.isoobss.project.service.ProfileService;

@Controller
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {
    private final ProfileService profileService;
    
    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/mail/{encodedMail}")
    public ResponseEntity<?> getProfile(@PathVariable String encodedMail) {
        try {
            String mail = URLDecoder.decode(encodedMail, StandardCharsets.UTF_8.name());
            Applicant applicant = profileService.getProfile(mail);
            if (applicant != null) {
                return ResponseEntity.ok(applicant);
            } else {
                return ResponseEntity.badRequest().body(mail + "email cannot be found!");
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{userUrlId}")
    public ResponseEntity<?> getProfileByUrlId(@PathVariable String userUrlId) {
        Applicant applicant = profileService.getProfileByUrlId(userUrlId);  
        if (applicant != null) {
            return ResponseEntity.ok(applicant);
        } else {
            return ResponseEntity.badRequest().body(userUrlId + ": User cannot be found!");
        }
    }
}
