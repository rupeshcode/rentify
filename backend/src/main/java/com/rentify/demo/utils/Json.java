package com.rentify.demo.utils;

import com.rentify.demo.crypto.Crypto;
import com.rentify.demo.exceptions.BadRequestException;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class Json {
  public static final ObjectMapper mapper = new ObjectMapper();
  private static final Crypto crypto = new Crypto();

  static {
    mapper.findAndRegisterModules();
  }

  public static String serialize(Object obj) throws Exception {
    String jsonString = mapper.writer().writeValueAsString(obj);
    return crypto.encrypt(jsonString);
  }

  public static <T> T deserialize(Class<T> tDotClass, String str) throws Exception {
    String decryptedString = crypto.decrypt(str);
    if (decryptedString == null) {
      throw new BadRequestException("Could not read request data");
    }
    return mapper.readerFor(tDotClass).readValue(decryptedString);
  }
}
