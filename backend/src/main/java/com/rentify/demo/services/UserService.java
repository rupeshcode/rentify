package com.rentify.demo.services;

import org.apache.commons.lang3.StringUtils;
import com.rentify.demo.exceptions.BadRequestException;
import com.rentify.demo.models.User;
import com.rentify.demo.repositories.UserRepo;
import com.rentify.demo.security.jwt.Jwt;
import com.rentify.demo.security.jwt.JwtActions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

  @Autowired
  @Lazy
  AuthenticationManager authenticationManager;

  @Autowired
  BCryptPasswordEncoder encoder;

  @Autowired
  UserRepo userRepo;

  @Autowired
  JwtActions jwtActions;

  @Autowired
  JdbcTemplate jdbcTemplate;

  @Value("${spring.profiles.active}")
  private String activeProfile;

  public void validateUsername(String username) throws Exception {
    if (StringUtils.isBlank(username)) {
      throw new BadRequestException("Invalid username");
    }
  }

  public void validatePassword(String password) throws Exception {
    if (StringUtils.isBlank(password) || password.length() < 8) {
      throw new BadRequestException("Invalid password");
    }
  }

  public User authenticateUser(String username, String password)
      throws Exception {
    Authentication authentication = null;
    try {
      authentication = authenticationManager
          .authenticate(new UsernamePasswordAuthenticationToken(username, password));
      SecurityContextHolder.getContext().setAuthentication(authentication);
      return userRepo.findFirstByUsername(username);
    } catch (Exception ex) {
      throw new BadRequestException("Invalid username or password");
    }
  }

  public String generateJwt(User user, String fp) {
    long now = System.currentTimeMillis();
    String jwt = jwtActions.generate(new Jwt(user.getUsername(), fp, now));
    jdbcTemplate.update("""
        UPDATE users SET jwt_timestamp = ? WHERE id = ?
        """, now, user.getId());
    return jwt;
  }

  @Override
  public UserDetails loadUserByUsername(String username)
      throws UsernameNotFoundException {
    User user = userRepo.findByUsername(username);
    if (user == null) {
      throw new UsernameNotFoundException("User not found.");
    }
    return user;
  }

}

