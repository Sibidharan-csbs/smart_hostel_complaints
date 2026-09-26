package com.hostel.complaints.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class ComplaintHistory implements Serializable {
    private static final long serialVersionUID = 1L;

    private int historyId;
    private String complaintId;
    private String previousStatus;
    private String newStatus;
    private String remarks;
    private String updatedBy;
    private Timestamp updatedAt;

    public ComplaintHistory() {}

    public ComplaintHistory(int historyId, String complaintId, String previousStatus, String newStatus, String remarks, String updatedBy, Timestamp updatedAt) {
        this.historyId = historyId;
        this.complaintId = complaintId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.remarks = remarks;
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt;
    }

    public int getHistoryId() {
        return historyId;
    }

    public void setHistoryId(int historyId) {
        this.historyId = historyId;
    }

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(String previousStatus) {
        this.previousStatus = previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
