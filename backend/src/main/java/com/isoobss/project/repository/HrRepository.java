package com.isoobss.project.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.isoobss.project.model.Hr;

@Repository
public interface HrRepository extends MongoRepository<Hr, ObjectId> {

    Hr findByUsername(String username);
    
}
