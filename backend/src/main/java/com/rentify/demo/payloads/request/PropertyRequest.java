package com.rentify.demo.payloads.request;

public record PropertyRequest(String place, Double area, Integer noOfBathroom,
    Integer noOfBedroom, String nearByArea, String nameOfNearByArea, Double price,
    Long sellerId) {

}
