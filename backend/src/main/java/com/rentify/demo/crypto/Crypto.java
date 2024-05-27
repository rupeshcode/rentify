package com.rentify.demo.crypto;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Component;

import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Arrays;
import java.util.Objects;

@Component
public class Crypto {

  private static final String CIPHER_ALGORITHM = "AES/GCM/NoPadding";
  private static final String SECRET_KEY_ALGORITHM = "PBKDF2WithHmacSHA256";
  private static final String KEY_FOR_ALGORITHM = "AES";
  private static final int KEY_SIZE = 256;
  private static final int ITERATIONS = 179;
  private final int IV_SIZE = 128;
  private static final String SECRET_KEY = "@#ZBJ$u%1M+3o[v0c*HD!>dQE}9:1A?";

  public Crypto() {
    try {
      Cipher.getInstance(CIPHER_ALGORITHM);
    } catch (NoSuchAlgorithmException | NoSuchPaddingException ex) {
      System.err.println("--- Error instantiating crypto ---");
      ex.printStackTrace();
      System.err.println("--- x ---");
    }
  }

  private SecretKey makeAesKey(byte[] salt, String password)
      throws InvalidKeySpecException, NoSuchAlgorithmException {
    SecretKeyFactory secretKeyFactory =
        SecretKeyFactory.getInstance(SECRET_KEY_ALGORITHM);
    KeySpec keySpec = new PBEKeySpec(password.toCharArray(), salt,
        ITERATIONS, KEY_SIZE);
    return new SecretKeySpec(secretKeyFactory.generateSecret(keySpec).getEncoded(),
        KEY_FOR_ALGORITHM);
  }

  public String encrypt(String plainText)
      throws InvalidKeyException, InvalidAlgorithmParameterException,
      IllegalBlockSizeException, BadPaddingException,
      InvalidKeySpecException, NoSuchAlgorithmException, NoSuchPaddingException {
    byte[] saltBytes = generateRandom(16);
    byte[] ivBytes = generateRandom(16);
    SecretKey secretKey = makeAesKey(saltBytes, SECRET_KEY);
    Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(IV_SIZE, ivBytes));
    byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
    byte[] cipherBytes =
        new byte[saltBytes.length + ivBytes.length + encryptedBytes.length];
    System.arraycopy(saltBytes, 0, cipherBytes, 0, saltBytes.length);
    System.arraycopy(ivBytes, 0, cipherBytes, saltBytes.length, ivBytes.length);
    System.arraycopy(encryptedBytes, 0, cipherBytes, saltBytes.length + ivBytes.length,
        encryptedBytes.length);
    return toBase64(cipherBytes);
  }

  public String decrypt(String cipherText)
      throws InvalidKeyException, InvalidAlgorithmParameterException,
      IllegalBlockSizeException, BadPaddingException,
      InvalidKeySpecException, NoSuchAlgorithmException, NoSuchPaddingException {
    byte[] cipherBytes = fromBase64(cipherText);
    byte[] saltBytes = Arrays.copyOfRange(cipherBytes, 0, 16);
    byte[] ivBytes = Arrays.copyOfRange(cipherBytes, 16, 32);
    byte[] encryptedBytes = Arrays.copyOfRange(cipherBytes, 32, cipherBytes.length);
    SecretKey secretKey = makeAesKey(saltBytes, SECRET_KEY);
    Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
    cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(IV_SIZE, ivBytes));
    byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
    return new String(Objects.requireNonNull(decryptedBytes), StandardCharsets.UTF_8);
  }

  private static byte[] fromBase64(String str) {
    return Base64.decodeBase64(str);
  }

  private static String toBase64(byte[] ba) {
    return Base64.encodeBase64String(ba);
  }

  private static byte[] generateRandom(int length) {
    SecureRandom random = new SecureRandom();
    byte[] randomBytes = new byte[length];
    random.nextBytes(randomBytes);
    return randomBytes;
  }

}
