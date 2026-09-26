package com.hostel.complaints.util;

import at.favre.lib.crypto.bcrypt.BCrypt;

public class PasswordUtil {

    private static final int COST_FACTOR = 12;

    public static String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty.");
        }
        return BCrypt.withDefaults().hashToString(COST_FACTOR, plainPassword.toCharArray());
    }

    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) {
            return false;
        }
        BCrypt.Result result = BCrypt.verifyer().verify(plainPassword.toCharArray(), hashedPassword);
        return result.verified;
    }
}
