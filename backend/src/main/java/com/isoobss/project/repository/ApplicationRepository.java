package com.isoobss.project.repository;

import java.util.Collection;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.isoobss.project.model.Application;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, ObjectId> {

    List<Application> findByApplicantId(ObjectId objectId);
    
}
