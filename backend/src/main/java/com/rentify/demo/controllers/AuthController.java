package com.rentify.demo.controllers;

import java.util.Set;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.rentify.demo.exceptions.BadRequestException;
import com.rentify.demo.models.Role;
import com.rentify.demo.models.User;
import com.rentify.demo.payloads.request.EncryptedRequest;
import com.rentify.demo.payloads.request.LoginRequest;
import com.rentify.demo.payloads.request.SignupRequest;
import com.rentify.demo.payloads.response.EncryptedResponse;
import com.rentify.demo.payloads.response.LoginResponse;
import com.rentify.demo.repositories.UserRepo;
import com.rentify.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @Autowired
  BCryptPasswordEncoder encoder;

  @Autowired
  UserService userService;

  @Autowired
  UserRepo userRepo;

  @PostMapping("/sign-in")
  public <json> EncryptedResponse signIn(@Valid @RequestBody EncryptedRequest req)
      throws Exception {

    var body = req.bodyAs(LoginRequest.class);
    String username = body.username();
    String password = body.password();
    String fp = body.fp();

    // userService.validateUsername(username);
    userService.validatePassword(password);
    User user = userService.authenticateUser(username, password);

    if (((Role) user.getRoles().toArray()[0]).getRoleId() == body.roleId()) {
      String jwt = userService.generateJwt(user, fp);
      return new EncryptedResponse(new LoginResponse(jwt, user));
    } else {
      throw new BadRequestException("Invalid Credentials for selected role!");
    }
  }

  @PostMapping("/register")
  public EncryptedResponse registerUser(@Valid @RequestBody EncryptedRequest req)
      throws Exception {

    var body = req.bodyAs(SignupRequest.class);

    String username = body.username();
    String password = body.password();
    String mobile = body.mobile();
    String firstName = body.firstName();
    String lastName = body.lastName();


    if (userRepo.existsByUsername(username)) {
      throw new BadRequestException("Email already exists!");
    }

    User user = new User();
    user.setUsername(username);
    user.setRoles(Set.of(new Role(body.roleId())));
    user.setMobile(mobile);
    user.setPassword(encoder.encode(password));
    user.setFirstName(firstName);
    user.setLastName(lastName);

    userRepo.save(user);

    return new EncryptedResponse("Registered");
  }

}
