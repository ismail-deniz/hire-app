package com.isoobss.project.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.isoobss.project.model.Recruiter;

@Repository
public interface RecruiterRepository extends MongoRepository<Recruiter, ObjectId> {
    
}
