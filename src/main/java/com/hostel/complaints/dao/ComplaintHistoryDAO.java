package com.hostel.complaints.dao;

import com.hostel.complaints.model.ComplaintHistory;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ComplaintHistoryDAO {

    private static final Logger LOGGER = Logger.getLogger(ComplaintHistoryDAO.class.getName());

    public boolean addHistory(Connection conn, String complaintId, String previousStatus, String newStatus, String remarks, String updatedBy) throws SQLException {
        String sql = "INSERT INTO complaint_history (complaint_id, previous_status, new_status, remarks, updated_by) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, complaintId);
            stmt.setString(2, previousStatus);
            stmt.setString(3, newStatus);
            stmt.setString(4, remarks);
            stmt.setString(5, updatedBy);
            return stmt.executeUpdate() > 0;
        }
    }

    public List<ComplaintHistory> getHistoryByComplaintId(String complaintId) {
        List<ComplaintHistory> historyList = new ArrayList<>();
        String sql = "SELECT * FROM complaint_history WHERE complaint_id = ? ORDER BY updated_at ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, complaintId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    ComplaintHistory h = new ComplaintHistory();
                    h.setHistoryId(rs.getInt("history_id"));
                    h.setComplaintId(rs.getString("complaint_id"));
                    h.setPreviousStatus(rs.getString("previous_status"));
                    h.setNewStatus(rs.getString("new_status"));
                    h.setRemarks(rs.getString("remarks"));
                    h.setUpdatedBy(rs.getString("updated_by"));
                    h.setUpdatedAt(rs.getTimestamp("updated_at"));
                    historyList.add(h);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching history for complaint: " + complaintId, e);
        }
        return historyList;
    }
}
