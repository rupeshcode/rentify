package com.rentify.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "properties")
public class Property {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private String place;
  private Double area;
  private Integer noOfBathroom;
  private Integer noOfBedroom;
  private String nearbyArea;
  private String nameOfNearByArea;
  private Double price;
  private Long sellerId;
  private Integer likeCount;

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getPlace() {
    return place;
  }

  public void setPlace(String place) {
    this.place = place;
  }

  public Double getArea() {
    return area;
  }

  public void setArea(Double area) {
    this.area = area;
  }

  public Integer getNoOfBathroom() {
    return noOfBathroom;
  }

  public void setNoOfBathroom(Integer noOfBathroom) {
    this.noOfBathroom = noOfBathroom;
  }

  public Integer getNoOfBedroom() {
    return noOfBedroom;
  }

  public void setNoOfBedroom(Integer noOfBedroom) {
    this.noOfBedroom = noOfBedroom;
  }

  public String getNearbyArea() {
    return nearbyArea;
  }

  public void setNearbyArea(String nearbyArea) {
    this.nearbyArea = nearbyArea;
  }

  public Double getPrice() {
    return price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }

  public Long getSellerId() {
    return sellerId;
  }

  public void setSellerId(Long sellerId) {
    this.sellerId = sellerId;
  }

  public Integer getLikeCount() {
    return likeCount;
  }

  public void setLikeCount(Integer likeCount) {
    this.likeCount = likeCount;
  }

  public String getNameOfNearByArea() {
    return nameOfNearByArea;
  }

  public void setNameOfNearByArea(String nameOfNearByArea) {
    this.nameOfNearByArea = nameOfNearByArea;
  }


}
