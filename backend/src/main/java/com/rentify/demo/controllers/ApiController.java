package com.rentify.demo.controllers;

import java.util.Map;

import com.rentify.demo.models.User;
import com.rentify.demo.payloads.response.EncryptedResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class ApiController {

  @PostMapping("/verify")
  public <json> EncryptedResponse verifyUser(HttpServletRequest req) throws Exception {
    var user = (User) req.getAttribute("user");
    var result = Map.of("verified", true, "user", user);
    return new EncryptedResponse(result);
  }
}
