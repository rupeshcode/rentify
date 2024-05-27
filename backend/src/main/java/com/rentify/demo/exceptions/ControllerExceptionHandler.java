package com.rentify.demo.exceptions;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class ControllerExceptionHandler {

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorMessage> messageNotReadableException(
      HttpMessageNotReadableException ex,
      WebRequest request) {
    ErrorMessage message = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), new Date(),
        "Could not read request body", request.getDescription(false));
    return new ResponseEntity<ErrorMessage>(message, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorMessage> methodArgInvalid(
      MethodArgumentNotValidException ex,
      WebRequest request) {
    ErrorMessage message = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), new Date(),
        ex.getFieldErrors().get(0).getDefaultMessage(), request.getDescription(false));
    return new ResponseEntity<ErrorMessage>(message, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorMessage> badRequestException(BadRequestException ex,
      WebRequest request) {
    ErrorMessage message = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), new Date(),
        ex.getMessage(), request.getDescription(false));
    return new ResponseEntity<ErrorMessage>(message, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorMessage> unauthorizedException(UnauthorizedException ex,
      WebRequest request) {
    ErrorMessage message = new ErrorMessage(HttpStatus.UNAUTHORIZED.value(), new Date(),
        ex.getMessage(), request.getDescription(false));
    return new ResponseEntity<ErrorMessage>(message, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<ErrorMessage> forbiddenException(ForbiddenException ex,
      WebRequest request) {
    ErrorMessage message = new ErrorMessage(HttpStatus.FORBIDDEN.value(), new Date(),
        ex.getMessage(), request.getDescription(false));
    return new ResponseEntity<ErrorMessage>(message, HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ErrorMessage> notFoundException(NotFoundException ex,
      WebRequest request) {
    ErrorMessage message = new ErrorMessage(HttpStatus.NOT_FOUND.value(), new Date(),
        ex.getMessage(), request.getDescription(false));
    return new ResponseEntity<ErrorMessage>(message, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> globalExceptionHandler(Exception ex, WebRequest request) {
    System.err.println("--- Caught in global exception handler ---");
    ex.printStackTrace();
    System.err.println("--- x ---");
    ErrorMessage message = new ErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(),
        new Date(), ex.getMessage(), request.getDescription(false));
    return new ResponseEntity<ErrorMessage>(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
