package com.rentify.demo.payloads.request;


public record LoginRequest(String username, String password, String fp, int roleId) {}
