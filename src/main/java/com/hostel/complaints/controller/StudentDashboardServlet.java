package com.hostel.complaints.controller;

import com.hostel.complaints.dao.ComplaintDAO;
import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

@WebServlet("/student/dashboard")
public class StudentDashboardServlet extends HttpServlet {

    private final ComplaintDAO complaintDAO = new ComplaintDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        User currentUser = (User) session.getAttribute("currentUser");

        List<Complaint> userComplaints = complaintDAO.getComplaintsByUserId(currentUser.getUserId(), null, null, null);

        int total = userComplaints.size();
        int pending = 0;
        int inProgress = 0;
        int resolved = 0;

        for (Complaint c : userComplaints) {
            if ("PENDING".equalsIgnoreCase(c.getStatus())) pending++;
            else if ("ASSIGNED".equalsIgnoreCase(c.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(c.getStatus())) inProgress++;
            else if ("RESOLVED".equalsIgnoreCase(c.getStatus())) resolved++;
        }

        request.setAttribute("totalComplaints", total);
        request.setAttribute("pendingComplaints", pending);
        request.setAttribute("inProgressComplaints", inProgress);
        request.setAttribute("resolvedComplaints", resolved);

        // Limit recent complaints to top 5
        List<Complaint> recentComplaints = userComplaints.stream().limit(5).toList();
        request.setAttribute("recentComplaints", recentComplaints);

        request.getRequestDispatcher("/student-dashboard.jsp").forward(request, response);
    }
}
