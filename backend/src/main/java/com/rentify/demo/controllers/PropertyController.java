package com.rentify.demo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentify.demo.models.Property;
import com.rentify.demo.payloads.request.EncryptedRequest;
import com.rentify.demo.payloads.request.GetId;
import com.rentify.demo.payloads.response.EncryptedResponse;
import com.rentify.demo.repositories.PropertyRepo;
import com.rentify.demo.utils.Json;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/property")
public class PropertyController {

  @Autowired
  PropertyRepo propertyRepo;

  // @PostMapping("/add")
  // public EncryptedResponse add(@RequestBody EncryptedRequest req) throws Exception {
  // Property body = req.bodyAs(Property.class);
  // try {
  // propertyRepo.save(body);
  // return new EncryptedResponse("added");
  // } catch (Exception e) {
  // throw new Exception("Something went wrong");
  // }

  // }

  @PostMapping("/add")
  public String add(@RequestBody Property body) throws Exception {
    // Property body = req.bodyAs(Property.class);
    try {
      propertyRepo.save(body);
      return "added";
    } catch (Exception e) {
      throw new Exception("Something went wrong");
    }

  }

  // @PostMapping("/get-all")
  // public EncryptedResponse getAll(@RequestBody EncryptedRequest req) throws Exception {
  // var body = req.bodyAs(Property.class);
  // Long sellerId = body.getSellerId();
  // List<Property> result = propertyRepo.findAllByFilters(sellerId,
  // body.getNoOfBedroom(), body.getNoOfBathroom());

  // return new EncryptedResponse(result);
  // }

  @PostMapping("/get-all")
  public List getAll(@RequestBody Property body) throws Exception {
    // var body = req.bodyAs(Property.class);
    Long sellerId = body.getSellerId();
    List<Property> result = propertyRepo.findAllByFilters(sellerId,
        body.getNoOfBedroom(), body.getNoOfBathroom());

    return result;
  }

  @PostMapping("/get-by-id")
  public EncryptedResponse getById(@RequestBody EncryptedRequest req) throws Exception {
    GetId body = req.bodyAs(GetId.class);
    Property property = propertyRepo.findById(body.id()).get();

    return new EncryptedResponse(property);
  }

  @PostMapping("/delete")
  public EncryptedResponse deleteProperty(@RequestBody EncryptedRequest req)
      throws Exception {
    var body = Json.deserialize(Property.class, req.getData());
    System.out.println("body: " + body);
    try {
      propertyRepo.deleteById(body.getId());
      return new EncryptedResponse("Deleted");
    } catch (Exception e) {
      throw new Exception("something went wrong");
    }
  }

  @PostMapping("/edit-property")
  public EncryptedResponse editExlInstitution(@RequestBody EncryptedRequest req)
      throws Exception {
    var body = req.bodyAs(Property.class);
    Property editData = propertyRepo.findEditProperty(body.getSellerId(), body.getId());
    // editData.setArea(body.getArea());
    // editData.setNameOfNearByArea(body.getNameOfNearByArea());
    // editData.setNearbyArea(body.getNearbyArea());
    // editData.setNoOfBathroom(body.getNoOfBathroom());
    // editData.setNoOfBedroom(body.getNoOfBedroom());
    // editData.setPlace(body.getPlace());
    // editData.setPrice(body.getPrice());

    propertyRepo.save(body);
    // System.out.println("editData " + editData.toString());
    return new EncryptedResponse("edited!");
  }

}
