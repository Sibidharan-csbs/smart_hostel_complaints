package com.hostel.complaints.controller;

import com.hostel.complaints.dao.UserDAO;
import com.hostel.complaints.model.User;
import com.hostel.complaints.util.CSRFUtil;
import com.hostel.complaints.util.PasswordUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        request.setAttribute("csrfToken", CSRFUtil.getToken(session));
        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!CSRFUtil.validateToken(request)) {
            request.setAttribute("errorMessage", "Invalid security token. Please try again.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
            return;
        }

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Please provide both email and password.");
            request.setAttribute("email", email);
            request.getRequestDispatcher("/login.jsp").forward(request, response);
            return;
        }

        User user = userDAO.getUserByEmail(email.trim());
        if (user != null && PasswordUtil.checkPassword(password, user.getPassword())) {
            HttpSession session = request.getSession(true);
            session.setAttribute("currentUser", user);

            if (user.isAdmin()) {
                response.sendRedirect(request.getContextPath() + "/admin/dashboard");
            } else {
                response.sendRedirect(request.getContextPath() + "/student/dashboard");
            }
        } else {
            request.setAttribute("errorMessage", "Invalid email or password.");
            request.setAttribute("email", email);
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }
}
