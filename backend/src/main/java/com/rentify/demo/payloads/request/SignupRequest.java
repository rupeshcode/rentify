package com.rentify.demo.payloads.request;

import jakarta.validation.constraints.*;

public record SignupRequest(@NotBlank @Size(min = 3, max = 20) String username,
    int roleId,
    @NotBlank @Size(min = 6, max = 40) String password, String mobile, String firstName,
    String lastName) {}
