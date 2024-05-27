package com.rentify.demo.security.jwt;

import java.util.Date;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.Password;
import io.jsonwebtoken.security.SecurityException;

@Component
public class JwtActions {
  private static final Logger logger = LoggerFactory.getLogger(JwtActions.class);
  Password secretKey;

  @Value("${rentify.jwtSecret}")
  void setJwtSecretKey(String jwtSecretKey) {
    // this.secretKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
    this.secretKey = Keys.password(jwtSecretKey.toCharArray());
  }

  @Value("${rentify.jwtExpirationMs}")
  private int jwtExpirationMs;

  public String generate(Jwt jwt) {
    return Jwts
        .builder()
        .subject(jwt.subject())
        .claim("fp", jwt.fp())
        .issuedAt(new Date(jwt.timestamp()))
        .expiration(new Date(jwt.timestamp() + jwtExpirationMs))
        .encryptWith(secretKey, Jwts.KEY.PBES2_HS512_A256KW, Jwts.ENC.A256GCM)
        .compact();
  }

  public Optional<Jwt> validate(String token, String fpFromRequest) {
    if (StringUtils.isBlank(token)) {
      return Optional.empty();
    }
    try {
      Claims claims = Jwts.parser().decryptWith(secretKey).build()
          .parseEncryptedClaims(token).getPayload();
      String fpFromClaim = claims.get("fp", String.class);
      if (!fpFromClaim.equals(fpFromRequest)) {
        System.out.println("! F P");
        return Optional.empty();
      }
      String subject = claims.getSubject();
      long timestamp = claims.getIssuedAt().getTime();
      return Optional.of(new Jwt(subject, fpFromClaim, timestamp));
    } catch (SecurityException e) {
      logger.error("JWT validation error: invalid signature | {}", e.getMessage());
    } catch (MalformedJwtException e) {
      logger.error("JWT validation error: invalid token | {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT validation error: expired token | {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT validation error: unsupported token | {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT validation error: empty claims | {}", e.getMessage());
    }
    return Optional.empty();
  }
}
