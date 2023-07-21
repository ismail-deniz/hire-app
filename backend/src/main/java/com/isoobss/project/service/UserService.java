package com.isoobss.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
