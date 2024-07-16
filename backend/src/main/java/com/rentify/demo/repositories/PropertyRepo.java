package com.rentify.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rentify.demo.models.Property;

public interface PropertyRepo extends JpaRepository<Property, Long> {

  @Query(nativeQuery = true, value = """
      SELECT * FROM properties
      WHERE (?1 IS NULL OR seller_id = ?1)
      AND (?2 IS NULL OR no_of_bedroom = ?2)
      AND (?3 IS NULL OR no_of_bathroom = ?3)
      ORDER BY id
      """)
  List<Property> findAllByFilters(Long sellerId, Integer noOfBedRoom,
      Integer noOfBathRoom);


  @Query(nativeQuery = true, value = """

      SELECT * FROM properties
      WHERE seller_id = ?1
      AND id = ?2

          """)
  Property findEditProperty(Long sellerId, Long id);
}
