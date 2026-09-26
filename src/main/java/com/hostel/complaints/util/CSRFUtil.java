package com.hostel.complaints.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.security.SecureRandom;
import java.util.Base64;

public class CSRFUtil {

    private static final String CSRF_SESSION_ATTR = "CSRF_TOKEN";
    private static final SecureRandom random = new SecureRandom();

    public static String getToken(HttpSession session) {
        if (session == null) {
            return null;
        }
        String token = (String) session.getAttribute(CSRF_SESSION_ATTR);
        if (token == null) {
            byte[] bytes = new byte[32];
            random.nextBytes(bytes);
            token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            session.setAttribute(CSRF_SESSION_ATTR, token);
        }
        return token;
    }

    public static boolean validateToken(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }
        String sessionToken = (String) session.getAttribute(CSRF_SESSION_ATTR);
        String requestToken = request.getParameter("csrfToken");
        if (requestToken == null) {
            requestToken = request.getHeader("X-CSRF-TOKEN");
        }
        return sessionToken != null && sessionToken.equals(requestToken);
    }
}
