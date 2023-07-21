package com.isoobss.project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.isoobss.project.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, Long> {
    
}
