package com.rentify.demo.security.jwt;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.rentify.demo.exceptions.UnauthorizedException;
import com.rentify.demo.models.User;
import com.rentify.demo.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;


public class AuthTokenFilter extends OncePerRequestFilter {
  @Value("${spring.profiles.active}")
  private String activeProfile;

  @Autowired
  private JwtActions jwtActions;

  @Autowired
  UserRepo userRepo;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String fpFromRequest = request.getHeader("fp");
    try {
      String token = parseJwt(request);
      var optJwt = jwtActions.validate(token, fpFromRequest);
      if (optJwt.isEmpty()) {
        return;
      }
      Jwt jwt = optJwt.get();
      String username = jwt.subject();
      User user = userRepo.findFirstByUsername(username);
      matchTimestampWithDb(user, jwt.timestamp());
      setAuthentication(request, user);
      request.setAttribute("user", user);
    } catch (Exception ex) {
      System.err.println("--- Caught in AuthTokenFilter ---");
      ex.printStackTrace();
      System.err.println("--- x ---");
    } finally {
      filterChain.doFilter(request, response);
    }

  }

  private void setAuthentication(HttpServletRequest request, User user) {
    var auth = new UsernamePasswordAuthenticationToken(user, null,
        user.getAuthorities());
    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    SecurityContextHolder.getContext().setAuthentication(auth);
  }

  private void matchTimestampWithDb(User user, long timestamp)
      throws UnauthorizedException {
    if (activeProfile.equals("dev")) {
      return;
    }
    long differenceInMillis = user.getJwtTimestamp() - timestamp;
    if (Math.abs(differenceInMillis) > 2000) {
      System.out.println("! M T");
      throw new UnauthorizedException("Invalid token");
    }
  }

  private String parseJwt(HttpServletRequest request) {
    String headerAuth = request.getHeader("Authorization");
    if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
      return headerAuth.substring(7, headerAuth.length());
    }
    return null;
  }

}
