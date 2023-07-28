package com.isoobss.project.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.isoobss.project.model.Applicant;

@Repository
public interface ApplicantRepository extends MongoRepository<Applicant, ObjectId> {

    Applicant findByEmail(String email);

    Applicant findByUrlId(String urlId);
    
}
