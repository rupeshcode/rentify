package com.rentify.demo.security.jwt;

public record Jwt(String subject, String fp, long timestamp) {}
