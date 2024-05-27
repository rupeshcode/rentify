package com.rentify.demo.payloads.request;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Sort;

public record PageReport(Pagination pagination, Sort sort, String search,
    LocalDate startDate,
    LocalDate endDate,
    Map<String, Object> custom) {};
