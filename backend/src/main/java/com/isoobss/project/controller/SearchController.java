package com.isoobss.project.controller;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.isoobss.project.dto.ApplicantDTO;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.service.ApplicantService;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
public class SearchController {
    private final ApplicantService applicantService;

    @Autowired
    public SearchController(ApplicantService applicantService) {
        this.applicantService = applicantService;
    }
    
    @GetMapping("/all")
    public List<ApplicantDTO> search(@RequestParam String text) {
        try {
            System.out.println("searching...");
            return applicantService.searchAllApplicantsBy(text);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping
    public List<ApplicantDTO> search(@RequestParam String text, @RequestParam String openingId) {
        try {
            System.out.println("searching...");
            return applicantService.searchAllApplicantsOfOpeningBy(new ObjectId(openingId), text);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
