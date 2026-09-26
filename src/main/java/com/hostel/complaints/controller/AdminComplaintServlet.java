package com.hostel.complaints.controller;

import com.hostel.complaints.dao.ComplaintDAO;
import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.model.User;
import com.hostel.complaints.util.CSRFUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

@WebServlet("/admin/complaint")
public class AdminComplaintServlet extends HttpServlet {

    private final ComplaintDAO complaintDAO = new ComplaintDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        String action = request.getParameter("action");
        if (action == null) action = "list";

        request.setAttribute("csrfToken", CSRFUtil.getToken(session));

        switch (action.toLowerCase()) {
            case "view":
                String complaintId = request.getParameter("id");
                if (complaintId == null || complaintId.trim().isEmpty()) {
                    response.sendRedirect(request.getContextPath() + "/admin/complaint?action=list");
                    return;
                }
                Complaint complaint = complaintDAO.getComplaintById(complaintId.trim());
                if (complaint == null) {
                    sessionAttributeMessage(request, "errorMessage", "Complaint not found.");
                    response.sendRedirect(request.getContextPath() + "/admin/complaint?action=list");
                    return;
                }
                request.setAttribute("complaint", complaint);
                request.getRequestDispatcher("/complaint-details.jsp").forward(request, response);
                break;

            case "list":
            default:
                String search = request.getParameter("search");
                String status = request.getParameter("status");
                String category = request.getParameter("category");
                String priority = request.getParameter("priority");

                List<Complaint> complaints = complaintDAO.getAllComplaints(search, status, category, priority);

                request.setAttribute("complaints", complaints);
                request.setAttribute("search", search);
                request.setAttribute("status", status);
                request.setAttribute("category", category);
                request.setAttribute("priority", priority);
                request.getRequestDispatcher("/admin-complaints.jsp").forward(request, response);
                break;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!CSRFUtil.validateToken(request)) {
            sessionAttributeMessage(request, "errorMessage", "Invalid security token. Please try again.");
            response.sendRedirect(request.getContextPath() + "/admin/complaint?action=list");
            return;
        }

        HttpSession session = request.getSession(false);
        User currentUser = (User) session.getAttribute("currentUser");

        String action = request.getParameter("action");
        if (action == null) action = "updateStatus";

        if ("updateStatus".equalsIgnoreCase(action)) {
            handleUpdateStatus(request, response, currentUser);
        } else if ("delete".equalsIgnoreCase(action)) {
            handleDeleteComplaint(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/admin/complaint?action=list");
        }
    }

    private void handleUpdateStatus(HttpServletRequest request, HttpServletResponse response, User currentUser)
            throws IOException {

        String complaintId = request.getParameter("complaintId");
        String newStatus = request.getParameter("status");
        String assignedTo = request.getParameter("assignedTo");
        String adminRemarks = request.getParameter("adminRemarks");
        String resolutionDetails = request.getParameter("resolutionDetails");

        if (complaintId == null || complaintId.trim().isEmpty() || newStatus == null || newStatus.trim().isEmpty()) {
            sessionAttributeMessage(request, "errorMessage", "Complaint ID and Status are required.");
            response.sendRedirect(request.getContextPath() + "/admin/complaint?action=list");
            return;
        }

        boolean success = complaintDAO.updateComplaintStatus(
                complaintId.trim(),
                newStatus.trim(),
                assignedTo != null ? assignedTo.trim() : null,
                adminRemarks != null ? adminRemarks.trim() : null,
                resolutionDetails != null ? resolutionDetails.trim() : null,
                currentUser.getName()
        );

        if (success) {
            sessionAttributeMessage(request, "successMessage", "Complaint " + complaintId + " updated successfully!");
        } else {
            sessionAttributeMessage(request, "errorMessage", "Failed to update complaint status.");
        }

        String referer = request.getHeader("referer");
        if (referer != null && referer.contains("action=view")) {
            response.sendRedirect(request.getContextPath() + "/admin/complaint?action=view&id=" + complaintId.trim());
        } else {
            response.sendRedirect(request.getContextPath() + "/admin/complaint?action=list");
        }
    }

    private void handleDeleteComplaint(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String complaintId = request.getParameter("complaintId");
        if (complaintId != null && !complaintId.trim().isEmpty()) {
            if (complaintDAO.deleteComplaint(complaintId.trim())) {
                sessionAttributeMessage(request, "successMessage", "Complaint " + complaintId + " deleted successfully!");
            } else {
                sessionAttributeMessage(request, "errorMessage", "Failed to delete complaint.");
            }
        }
        response.sendRedirect(request.getContextPath() + "/admin/complaint?action=list");
    }

    private void sessionAttributeMessage(HttpServletRequest request, String key, String value) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.setAttribute(key, value);
        }
    }
}
