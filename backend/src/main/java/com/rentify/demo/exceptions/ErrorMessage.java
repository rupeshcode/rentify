package com.rentify.demo.exceptions;

import java.util.Date;

public class ErrorMessage {
  private int statusCode;
  private Date timestamp;
  private String error;
  private String description;

  public ErrorMessage(int statusCode, Date timestamp, String message,
      String description) {
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.error = message;
    this.description = description;
  }

  public int getStatusCode() {
    return statusCode;
  }

  public Date getTimestamp() {
    return timestamp;
  }

  public String getError() {
    return error;
  }

  public String getDescription() {
    return description;
  }
}
