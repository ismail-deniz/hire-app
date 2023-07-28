package com.isoobss.project.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.model.Opening;
import com.isoobss.project.repository.OpeningRepository;
import com.isoobss.project.request.CreateOpeningRequest;

@Service
public class OpeningService {
    private final OpeningRepository openingRepository;

    @Autowired
    public OpeningService(OpeningRepository openingRepository) {
        this.openingRepository = openingRepository;
    }

    public Opening createOpening(CreateOpeningRequest req) {
        Opening newOpening = new Opening();
        newOpening.setTitle(req.getTitle());
        newOpening.setExplanation(req.getExplanation());
        newOpening.setQualifications(req.getQualifications());
        newOpening.setApplicants(new ArrayList<ObjectId>());
        newOpening.setActive(req.isActive());
        newOpening.setActivationDate(req.isActive() ? new Date() : req.getActiveDate());
        newOpening.setDeactivationDate(req.isActive() ? req.getDeactiveDate() : new Date());
        
        openingRepository.save(newOpening);
        return newOpening;
    }

    public List<Opening> getAllOpenings() {
        return openingRepository.findAll();
    }

}
