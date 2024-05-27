package com.rentify.demo.security;

import java.util.Arrays;

import com.rentify.demo.security.filters.AuthHeaderFilter;
import com.rentify.demo.security.jwt.AuthEntryPointJwt;
import com.rentify.demo.security.jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
public class WebSecurityConfig {

  @Autowired
  private AuthEntryPointJwt jwtEntryPoint;

  @Bean
  AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration config)
      throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("*"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    http
        .cors(configurer -> configurer.configurationSource(source))
        .csrf(configurer -> configurer.disable())
        .sessionManagement(
            configurer -> configurer
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(
            configurer -> configurer.authenticationEntryPoint(jwtEntryPoint))
        .authorizeHttpRequests(registry -> registry
            .requestMatchers(antMatcher("/auth/**"), antMatcher("/files/**"),
                antMatcher("/property/**"))
            .permitAll()
            .anyRequest().authenticated())
        .addFilterBefore(authenticationJwtTokenFilter(),
            UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(new AuthHeaderFilter(), AuthTokenFilter.class);

    return http.build();
  }

}
