package com.rentify.demo.repositories;

import java.util.List;
import java.util.Map;

import com.rentify.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import jakarta.persistence.LockModeType;

public interface UserRepo extends JpaRepository<User, Long> {

  User findByUsername(String username);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  User findLockedById(long id);

  User findFirstByUsername(String username);

  User findById(long id);

  Boolean existsByUsername(String username);

  // Boolean existsByEmail(String email);


  @Query(nativeQuery = true,
      value = """
          SELECT id, username, email, display_name, employee_id, manager_id, profile_photo, gender, department FROM users WHERE username != 'admin'
            """)
  List<Map<String, Object>> getAllUsers(Long id);

}
