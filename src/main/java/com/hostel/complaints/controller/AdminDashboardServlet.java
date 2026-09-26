package com.hostel.complaints.controller;

import com.hostel.complaints.dao.ComplaintDAO;
import com.hostel.complaints.dao.UserDAO;
import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {

    private final ComplaintDAO complaintDAO = new ComplaintDAO();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Map<String, Integer> stats = complaintDAO.getDashboardStats();
        request.setAttribute("stats", stats);

        List<Complaint> recentComplaints = complaintDAO.getAllComplaints(null, null, null, null).stream().limit(5).toList();
        request.setAttribute("recentComplaints", recentComplaints);

        List<User> students = userDAO.getAllStudents();
        request.setAttribute("students", students);

        request.getRequestDispatcher("/admin-dashboard.jsp").forward(request, response);
    }
}
