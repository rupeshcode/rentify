package com.rentify.demo.security.filters;

import java.io.IOException;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthHeaderFilter extends OncePerRequestFilter {

  private static final String ALLOW_GIS = "%?Y?_TYqc2QM7^p4t#>c";

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String servletPath = request.getServletPath();
    String gisHeader = request.getHeader("allow-gis");

    if (servletPath.startsWith("/gis/") && ALLOW_GIS.equals(gisHeader)) {
      var auth =
          new PreAuthenticatedAuthenticationToken("auth-by-header", gisHeader);
      auth.setAuthenticated(true);
      auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
      SecurityContextHolder.getContext().setAuthentication(auth);
      request.getRequestDispatcher(servletPath).forward(request, response);
      return;
    }

    filterChain.doFilter(request, response);
  }

}
