package com.hostel.complaints.dao;

import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.model.ComplaintHistory;
import com.hostel.complaints.model.ComplaintImage;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ComplaintDAO {

    private static final Logger LOGGER = Logger.getLogger(ComplaintDAO.class.getName());
    private final ComplaintHistoryDAO historyDAO = new ComplaintHistoryDAO();

    public String generateComplaintId(Connection conn) throws SQLException {
        String prefix = "CMP-";
        long timestamp = System.currentTimeMillis() % 1000000;
        int randomNum = (int) (Math.random() * 900) + 100;
        String candidate = prefix + timestamp + randomNum;

        String checkSql = "SELECT 1 FROM complaints WHERE complaint_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(checkSql)) {
            stmt.setString(1, candidate);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return generateComplaintId(conn); // retry if collision
                }
            }
        }
        return candidate;
    }

    public boolean createComplaint(Complaint complaint, List<String> imageFileNames, String createdBy) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            if (complaint.getComplaintId() == null || complaint.getComplaintId().trim().isEmpty()) {
                complaint.setComplaintId(generateComplaintId(conn));
            }

            String sql = "INSERT INTO complaints (complaint_id, user_id, title, description, category, priority, status, room_number) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, complaint.getComplaintId());
                stmt.setInt(2, complaint.getUserId());
                stmt.setString(3, complaint.getTitle());
                stmt.setString(4, complaint.getDescription());
                stmt.setString(5, complaint.getCategory());
                stmt.setString(6, complaint.getPriority() != null ? complaint.getPriority() : "MEDIUM");
                stmt.setString(7, complaint.getRoomNumber());
                stmt.executeUpdate();
            }

            if (imageFileNames != null && !imageFileNames.isEmpty()) {
                String imgSql = "INSERT INTO complaint_images (complaint_id, file_name, file_path) VALUES (?, ?, ?)";
                try (PreparedStatement imgStmt = conn.prepareStatement(imgSql)) {
                    for (String fileName : imageFileNames) {
                        imgStmt.setString(1, complaint.getComplaintId());
                        imgStmt.setString(2, fileName);
                        imgStmt.setString(3, fileName);
                        imgStmt.addBatch();
                    }
                    imgStmt.executeBatch();
                }
            }

            historyDAO.addHistory(conn, complaint.getComplaintId(), null, "PENDING", "Complaint registered by student", createdBy);

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { LOGGER.log(Level.SEVERE, "Rollback error", ex); }
            }
            LOGGER.log(Level.SEVERE, "Error creating complaint", e);
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ex) { LOGGER.log(Level.SEVERE, "Connection close error", ex); }
            }
        }
        return false;
    }

    public Complaint getComplaintById(String complaintId) {
        String sql = "SELECT c.*, u.name as student_name, u.student_id as student_id_str " +
                     "FROM complaints c JOIN users u ON c.user_id = u.user_id WHERE c.complaint_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, complaintId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Complaint complaint = extractComplaintFromResultSet(rs);
                    complaint.setImages(getImagesForComplaint(conn, complaintId));
                    complaint.setHistoryList(historyDAO.getHistoryByComplaintId(complaintId));
                    return complaint;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching complaint by ID: " + complaintId, e);
        }
        return null;
    }

    public List<Complaint> getComplaintsByUserId(int userId, String search, String status, String category) {
        List<Complaint> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT c.*, u.name as student_name, u.student_id as student_id_str ")
                .append("FROM complaints c JOIN users u ON c.user_id = u.user_id WHERE c.user_id = ? ");

        List<Object> params = new ArrayList<>();
        params.add(userId);

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (c.complaint_id LIKE ? OR c.title LIKE ? OR c.description LIKE ?) ");
            String searchPattern = "%" + search.trim() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            sql.append("AND c.status = ? ");
            params.add(status.trim());
        }

        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
            sql.append("AND c.category = ? ");
            params.add(category.trim());
        }

        sql.append("ORDER BY c.created_at DESC");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Complaint c = extractComplaintFromResultSet(rs);
                    c.setImages(getImagesForComplaint(conn, c.getComplaintId()));
                    list.add(c);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching student complaints for userId: " + userId, e);
        }
        return list;
    }

    public List<Complaint> getAllComplaints(String search, String status, String category, String priority) {
        List<Complaint> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT c.*, u.name as student_name, u.student_id as student_id_str ")
                .append("FROM complaints c JOIN users u ON c.user_id = u.user_id WHERE 1=1 ");

        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (c.complaint_id LIKE ? OR u.name LIKE ? OR c.room_number LIKE ? OR c.title LIKE ?) ");
            String searchPattern = "%" + search.trim() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            sql.append("AND c.status = ? ");
            params.add(status.trim());
        }

        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
            sql.append("AND c.category = ? ");
            params.add(category.trim());
        }

        if (priority != null && !priority.trim().isEmpty() && !"ALL".equalsIgnoreCase(priority)) {
            sql.append("AND c.priority = ? ");
            params.add(priority.trim());
        }

        sql.append("ORDER BY c.created_at DESC");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Complaint c = extractComplaintFromResultSet(rs);
                    c.setImages(getImagesForComplaint(conn, c.getComplaintId()));
                    list.add(c);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching all complaints for admin", e);
        }
        return list;
    }

    public Map<String, Integer> getDashboardStats() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("TOTAL", 0);
        stats.put("PENDING", 0);
        stats.put("ASSIGNED", 0);
        stats.put("IN_PROGRESS", 0);
        stats.put("RESOLVED", 0);
        stats.put("REJECTED", 0);
        stats.put("OVERDUE", 0);

        String sql = "SELECT status, COUNT(*) as count FROM complaints GROUP BY status";
        String overdueSql = "SELECT COUNT(*) as count FROM complaints WHERE status IN ('PENDING', 'ASSIGNED') AND created_at < DATE_SUB(NOW(), INTERVAL 48 HOUR)";

        try (Connection conn = DBConnection.getConnection()) {
            try (PreparedStatement stmt = conn.prepareStatement(sql);
                 ResultSet rs = stmt.executeQuery()) {
                int total = 0;
                while (rs.next()) {
                    String st = rs.getString("status");
                    int count = rs.getInt("count");
                    stats.put(st, count);
                    total += count;
                }
                stats.put("TOTAL", total);
            }

            try (PreparedStatement stmt = conn.prepareStatement(overdueSql);
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    stats.put("OVERDUE", rs.getInt("count"));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error calculating dashboard statistics", e);
        }
        return stats;
    }

    public boolean updateComplaintStatus(String complaintId, String newStatus, String assignedTo, String adminRemarks, String resolutionDetails, String updatedBy) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            String prevStatus = null;
            String fetchPrevSql = "SELECT status FROM complaints WHERE complaint_id = ?";
            try (PreparedStatement fetchStmt = conn.prepareStatement(fetchPrevSql)) {
                fetchStmt.setString(1, complaintId);
                try (ResultSet rs = fetchStmt.executeQuery()) {
                    if (rs.next()) {
                        prevStatus = rs.getString("status");
                    }
                }
            }

            if (prevStatus == null) {
                return false;
            }

            StringBuilder sql = new StringBuilder("UPDATE complaints SET status = ?, updated_at = NOW() ");
            List<Object> params = new ArrayList<>();
            params.add(newStatus);

            if (assignedTo != null && !assignedTo.trim().isEmpty()) {
                sql.append(", assigned_to = ? ");
                params.add(assignedTo.trim());
            }

            if (adminRemarks != null && !adminRemarks.trim().isEmpty()) {
                sql.append(", admin_remarks = ? ");
                params.add(adminRemarks.trim());
            }

            if (resolutionDetails != null && !resolutionDetails.trim().isEmpty()) {
                sql.append(", resolution_details = ? ");
                params.add(resolutionDetails.trim());
            }

            sql.append("WHERE complaint_id = ?");
            params.add(complaintId);

            try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
                for (int i = 0; i < params.size(); i++) {
                    stmt.setObject(i + 1, params.get(i));
                }
                stmt.executeUpdate();
            }

            String historyRemark = adminRemarks;
            if (historyRemark == null || historyRemark.trim().isEmpty()) {
                historyRemark = "Status updated to " + newStatus;
            }

            historyDAO.addHistory(conn, complaintId, prevStatus, newStatus, historyRemark, updatedBy);

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { LOGGER.log(Level.SEVERE, "Rollback error", ex); }
            }
            LOGGER.log(Level.SEVERE, "Error updating complaint status for ID: " + complaintId, e);
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ex) { LOGGER.log(Level.SEVERE, "Close connection error", ex); }
            }
        }
        return false;
    }

    public boolean updateStudentComplaint(Complaint complaint, List<String> newImageFileNames, String updatedBy) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            String checkSql = "SELECT status FROM complaints WHERE complaint_id = ? AND user_id = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setString(1, complaint.getComplaintId());
                checkStmt.setInt(2, complaint.getUserId());
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (!rs.next() || !"PENDING".equals(rs.getString("status"))) {
                        return false; // Can only edit pending complaints
                    }
                }
            }

            String sql = "UPDATE complaints SET title = ?, description = ?, category = ?, priority = ?, room_number = ?, updated_at = NOW() WHERE complaint_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, complaint.getTitle());
                stmt.setString(2, complaint.getDescription());
                stmt.setString(3, complaint.getCategory());
                stmt.setString(4, complaint.getPriority());
                stmt.setString(5, complaint.getRoomNumber());
                stmt.setString(6, complaint.getComplaintId());
                stmt.executeUpdate();
            }

            if (newImageFileNames != null && !newImageFileNames.isEmpty()) {
                String imgSql = "INSERT INTO complaint_images (complaint_id, file_name, file_path) VALUES (?, ?, ?)";
                try (PreparedStatement imgStmt = conn.prepareStatement(imgSql)) {
                    for (String fileName : newImageFileNames) {
                        imgStmt.setString(1, complaint.getComplaintId());
                        imgStmt.setString(2, fileName);
                        imgStmt.setString(3, fileName);
                        imgStmt.addBatch();
                    }
                    imgStmt.executeBatch();
                }
            }

            historyDAO.addHistory(conn, complaint.getComplaintId(), "PENDING", "PENDING", "Complaint details edited by student", updatedBy);

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { LOGGER.log(Level.SEVERE, "Rollback error", ex); }
            }
            LOGGER.log(Level.SEVERE, "Error updating student complaint", e);
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ex) { LOGGER.log(Level.SEVERE, "Close connection error", ex); }
            }
        }
        return false;
    }

    public boolean cancelComplaint(String complaintId, int userId, String cancelledBy) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            String checkSql = "SELECT status FROM complaints WHERE complaint_id = ? AND user_id = ?";
            String prevStatus = null;
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setString(1, complaintId);
                checkStmt.setInt(2, userId);
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next()) {
                        prevStatus = rs.getString("status");
                    }
                }
            }

            if (prevStatus == null || !"PENDING".equals(prevStatus)) {
                return false; // Can only cancel pending complaints
            }

            String sql = "UPDATE complaints SET status = 'REJECTED', admin_remarks = 'Cancelled by student', updated_at = NOW() WHERE complaint_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, complaintId);
                stmt.executeUpdate();
            }

            historyDAO.addHistory(conn, complaintId, prevStatus, "REJECTED", "Complaint cancelled by student", cancelledBy);

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { LOGGER.log(Level.SEVERE, "Rollback error", ex); }
            }
            LOGGER.log(Level.SEVERE, "Error cancelling complaint ID: " + complaintId, e);
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ex) { LOGGER.log(Level.SEVERE, "Close connection error", ex); }
            }
        }
        return false;
    }

    public boolean deleteComplaint(String complaintId) {
        String sql = "DELETE FROM complaints WHERE complaint_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, complaintId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting complaint ID: " + complaintId, e);
        }
        return false;
    }

    private List<ComplaintImage> getImagesForComplaint(Connection conn, String complaintId) throws SQLException {
        List<ComplaintImage> images = new ArrayList<>();
        String sql = "SELECT * FROM complaint_images WHERE complaint_id = ? ORDER BY uploaded_at ASC";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, complaintId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    ComplaintImage img = new ComplaintImage();
                    img.setImageId(rs.getInt("image_id"));
                    img.setComplaintId(rs.getString("complaint_id"));
                    img.setFileName(rs.getString("file_name"));
                    img.setFilePath(rs.getString("file_path"));
                    img.setUploadedAt(rs.getTimestamp("uploaded_at"));
                    images.add(img);
                }
            }
        }
        return images;
    }

    private Complaint extractComplaintFromResultSet(ResultSet rs) throws SQLException {
        Complaint c = new Complaint();
        c.setComplaintId(rs.getString("complaint_id"));
        c.setUserId(rs.getInt("user_id"));
        try { c.setStudentName(rs.getString("student_name")); } catch (SQLException ignored) {}
        try { c.setStudentIdStr(rs.getString("student_id_str")); } catch (SQLException ignored) {}
        c.setTitle(rs.getString("title"));
        c.setDescription(rs.getString("description"));
        c.setCategory(rs.getString("category"));
        c.setPriority(rs.getString("priority"));
        c.setStatus(rs.getString("status"));
        c.setRoomNumber(rs.getString("room_number"));
        c.setAssignedTo(rs.getString("assigned_to"));
        c.setAdminRemarks(rs.getString("admin_remarks"));
        c.setResolutionDetails(rs.getString("resolution_details"));
        c.setCreatedAt(rs.getTimestamp("created_at"));
        c.setUpdatedAt(rs.getTimestamp("updated_at"));
        return c;
    }
}
