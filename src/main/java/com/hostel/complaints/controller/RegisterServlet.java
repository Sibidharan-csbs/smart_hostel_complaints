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

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        request.setAttribute("csrfToken", CSRFUtil.getToken(session));
        request.getRequestDispatcher("/register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!CSRFUtil.validateToken(request)) {
            request.setAttribute("errorMessage", "Invalid security token. Please try again.");
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        String name = request.getParameter("name");
        String studentId = request.getParameter("studentId");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        String department = request.getParameter("department");
        String roomNumber = request.getParameter("roomNumber");

        if (name == null || name.trim().isEmpty() ||
            studentId == null || studentId.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty() ||
            department == null || department.trim().isEmpty() ||
            roomNumber == null || roomNumber.trim().isEmpty()) {

            request.setAttribute("errorMessage", "All fields are required.");
            preserveFormInputs(request, name, studentId, email, department, roomNumber);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        if (!password.equals(confirmPassword)) {
            request.setAttribute("errorMessage", "Passwords do not match.");
            preserveFormInputs(request, name, studentId, email, department, roomNumber);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        if (password.length() < 6) {
            request.setAttribute("errorMessage", "Password must be at least 6 characters long.");
            preserveFormInputs(request, name, studentId, email, department, roomNumber);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        if (userDAO.emailExists(email.trim())) {
            request.setAttribute("errorMessage", "Email is already registered.");
            preserveFormInputs(request, name, studentId, email, department, roomNumber);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        if (userDAO.studentIdExists(studentId.trim())) {
            request.setAttribute("errorMessage", "Student ID is already registered.");
            preserveFormInputs(request, name, studentId, email, department, roomNumber);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        User newUser = new User();
        newUser.setName(name.trim());
        newUser.setStudentId(studentId.trim().toUpperCase());
        newUser.setEmail(email.trim().toLowerCase());
        newUser.setPassword(PasswordUtil.hashPassword(password));
        newUser.setRole("STUDENT");
        newUser.setDepartment(department.trim());
        newUser.setRoomNumber(roomNumber.trim());

        if (userDAO.registerUser(newUser)) {
            request.setAttribute("successMessage", "Registration successful! Please log in.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        } else {
            request.setAttribute("errorMessage", "Registration failed due to a database error. Please try again.");
            preserveFormInputs(request, name, studentId, email, department, roomNumber);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
        }
    }

    private void preserveFormInputs(HttpServletRequest request, String name, String studentId, String email, String department, String roomNumber) {
        request.setAttribute("name", name);
        request.setAttribute("studentId", studentId);
        request.setAttribute("email", email);
        request.setAttribute("department", department);
        request.setAttribute("roomNumber", roomNumber);
    }
}
