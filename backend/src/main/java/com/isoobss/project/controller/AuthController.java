package com.isoobss.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.isoobss.project.request.LoginRequest;
import com.isoobss.project.service.AuthService;

@Controller
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest req) {
        System.out.println("OUTTTTTTTTTTTT");
        String token = authService.authenticate(req.getUserName(), req.getPassword());
        System.out.println("OUTTTTTTTTTTTT");
        return ResponseEntity.ok(token);
    }

    @GetMapping("")
    public ResponseEntity<?> authenticateGet(@RequestParam String userName, @RequestParam String password){
        System.out.println("OUTTTTTTTTTTTT");
        String token = authService.authenticate(userName, password);
        System.out.println("OUTTTTTTTTTTTT");
        return ResponseEntity.ok(token);
    }
}
