package com.rentify.demo.payloads.response;

import com.rentify.demo.models.User;

public record LoginResponse(String token, User user) {}
