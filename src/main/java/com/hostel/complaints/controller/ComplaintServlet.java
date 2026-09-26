package com.hostel.complaints.controller;

import com.hostel.complaints.dao.ComplaintDAO;
import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.model.User;
import com.hostel.complaints.util.CSRFUtil;
import com.hostel.complaints.util.FileUploadUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@WebServlet("/student/complaint")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024, // 1MB
        maxFileSize = 5 * 1024 * 1024,   // 5MB
        maxRequestSize = 20 * 1024 * 1024 // 20MB
)
public class ComplaintServlet extends HttpServlet {

    private final ComplaintDAO complaintDAO = new ComplaintDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        User currentUser = (User) session.getAttribute("currentUser");
        String action = request.getParameter("action");
        if (action == null) action = "history";

        request.setAttribute("csrfToken", CSRFUtil.getToken(session));

        switch (action.toLowerCase()) {
            case "new":
                request.setAttribute("roomNumber", currentUser.getRoomNumber());
                request.getRequestDispatcher("/new-complaint.jsp").forward(request, response);
                break;

            case "view":
                String viewId = request.getParameter("id");
                if (viewId == null || viewId.trim().isEmpty()) {
                    response.sendRedirect(request.getContextPath() + "/student/complaint?action=history");
                    return;
                }
                Complaint complaint = complaintDAO.getComplaintById(viewId.trim());
                if (complaint == null || (complaint.getUserId() != currentUser.getUserId() && !currentUser.isAdmin())) {
                    request.setAttribute("errorMessage", "Complaint not found or access denied.");
                    response.sendRedirect(request.getContextPath() + "/student/complaint?action=history");
                    return;
                }
                request.setAttribute("complaint", complaint);
                request.getRequestDispatcher("/complaint-details.jsp").forward(request, response);
                break;

            case "edit":
                String editId = request.getParameter("id");
                if (editId != null && !editId.trim().isEmpty()) {
                    Complaint editComplaint = complaintDAO.getComplaintById(editId.trim());
                    if (editComplaint != null && editComplaint.getUserId() == currentUser.getUserId() && "PENDING".equals(editComplaint.getStatus())) {
                        request.setAttribute("isEdit", true);
                        request.setAttribute("complaint", editComplaint);
                        request.getRequestDispatcher("/new-complaint.jsp").forward(request, response);
                        return;
                    }
                }
                response.sendRedirect(request.getContextPath() + "/student/complaint?action=history");
                break;

            case "history":
            default:
                String search = request.getParameter("search");
                String status = request.getParameter("status");
                String category = request.getParameter("category");

                List<Complaint> complaints = complaintDAO.getComplaintsByUserId(currentUser.getUserId(), search, status, category);

                request.setAttribute("complaints", complaints);
                request.setAttribute("search", search);
                request.setAttribute("status", status);
                request.setAttribute("category", category);
                request.getRequestDispatcher("/complaint-history.jsp").forward(request, response);
                break;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!CSRFUtil.validateToken(request)) {
            request.setAttribute("errorMessage", "Invalid security token. Please try again.");
            doGet(request, response);
            return;
        }

        HttpSession session = request.getSession(false);
        User currentUser = (User) session.getAttribute("currentUser");
        String action = request.getParameter("action");
        if (action == null) action = "create";

        if ("create".equalsIgnoreCase(action)) {
            handleCreateComplaint(request, response, currentUser);
        } else if ("update".equalsIgnoreCase(action)) {
            handleUpdateComplaint(request, response, currentUser);
        } else if ("cancel".equalsIgnoreCase(action)) {
            handleCancelComplaint(request, response, currentUser);
        } else {
            response.sendRedirect(request.getContextPath() + "/student/complaint?action=history");
        }
    }

    private void handleCreateComplaint(HttpServletRequest request, HttpServletResponse response, User currentUser)
            throws ServletException, IOException {

        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String category = request.getParameter("category");
        String priority = request.getParameter("priority");
        String roomNumber = request.getParameter("roomNumber");

        if (title == null || title.trim().isEmpty() ||
            description == null || description.trim().isEmpty() ||
            category == null || category.trim().isEmpty() ||
            roomNumber == null || roomNumber.trim().isEmpty()) {

            request.setAttribute("errorMessage", "Title, Description, Category, and Room Number are required.");
            request.setAttribute("title", title);
            request.setAttribute("description", description);
            request.setAttribute("category", category);
            request.setAttribute("priority", priority);
            request.setAttribute("roomNumber", roomNumber);
            request.getRequestDispatcher("/new-complaint.jsp").forward(request, response);
            return;
        }

        List<String> uploadedImages = processImageUploads(request);

        Complaint complaint = new Complaint();
        complaint.setUserId(currentUser.getUserId());
        complaint.setTitle(title.trim());
        complaint.setDescription(description.trim());
        complaint.setCategory(category.trim());
        complaint.setPriority(priority != null ? priority.trim() : "MEDIUM");
        complaint.setRoomNumber(roomNumber.trim());

        if (complaintDAO.createComplaint(complaint, uploadedImages, currentUser.getName())) {
            sessionAttributeMessage(request, "successMessage", "Complaint submitted successfully! Complaint ID: " + complaint.getComplaintId());
            response.sendRedirect(request.getContextPath() + "/student/complaint?action=history");
        } else {
            request.setAttribute("errorMessage", "Failed to submit complaint. Please try again.");
            request.getRequestDispatcher("/new-complaint.jsp").forward(request, response);
        }
    }

    private void handleUpdateComplaint(HttpServletRequest request, HttpServletResponse response, User currentUser)
            throws ServletException, IOException {

        String complaintId = request.getParameter("complaintId");
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String category = request.getParameter("category");
        String priority = request.getParameter("priority");
        String roomNumber = request.getParameter("roomNumber");

        if (complaintId == null || complaintId.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/student/complaint?action=history");
            return;
        }

        List<String> uploadedImages = processImageUploads(request);

        Complaint complaint = new Complaint();
        complaint.setComplaintId(complaintId.trim());
        complaint.setUserId(currentUser.getUserId());
        complaint.setTitle(title.trim());
        complaint.setDescription(description.trim());
        complaint.setCategory(category.trim());
        complaint.setPriority(priority != null ? priority.trim() : "MEDIUM");
        complaint.setRoomNumber(roomNumber.trim());

        if (complaintDAO.updateStudentComplaint(complaint, uploadedImages, currentUser.getName())) {
            sessionAttributeMessage(request, "successMessage", "Complaint updated successfully!");
            response.sendRedirect(request.getContextPath() + "/student/complaint?action=view&id=" + complaintId.trim());
        } else {
            request.setAttribute("errorMessage", "Failed to update complaint. Only PENDING complaints can be edited.");
            doGet(request, response);
        }
    }

    private void handleCancelComplaint(HttpServletRequest request, HttpServletResponse response, User currentUser)
            throws IOException {
        String complaintId = request.getParameter("complaintId");
        if (complaintId != null && !complaintId.trim().isEmpty()) {
            if (complaintDAO.cancelComplaint(complaintId.trim(), currentUser.getUserId(), currentUser.getName())) {
                sessionAttributeMessage(request, "successMessage", "Complaint " + complaintId + " has been cancelled.");
            } else {
                sessionAttributeMessage(request, "errorMessage", "Unable to cancel complaint. Only PENDING complaints can be cancelled.");
            }
        }
        response.sendRedirect(request.getContextPath() + "/student/complaint?action=history");
    }

    private List<String> processImageUploads(HttpServletRequest request) {
        List<String> uploadedFiles = new ArrayList<>();
        try {
            Collection<Part> parts = request.getParts();
            for (Part part : parts) {
                if ("images".equals(part.getName()) && part.getSize() > 0 && part.getSubmittedFileName() != null && !part.getSubmittedFileName().trim().isEmpty()) {
                    String fileName = FileUploadUtil.saveUploadedFile(part);
                    if (fileName != null) {
                        uploadedFiles.add(fileName);
                    }
                }
            }
        } catch (Exception e) {
            request.setAttribute("errorMessage", "Error uploading image: " + e.getMessage());
        }
        return uploadedFiles;
    }

    private void sessionAttributeMessage(HttpServletRequest request, String key, String value) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.setAttribute(key, value);
        }
    }
}
