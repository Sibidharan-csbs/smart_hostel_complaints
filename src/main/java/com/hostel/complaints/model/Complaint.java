package com.hostel.complaints.model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Complaint implements Serializable {
    private static final long serialVersionUID = 1L;

    private String complaintId;
    private int userId;
    private String studentName;
    private String studentIdStr;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String roomNumber;
    private String assignedTo;
    private String adminRemarks;
    private String resolutionDetails;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    private List<ComplaintImage> images = new ArrayList<>();
    private List<ComplaintHistory> historyList = new ArrayList<>();

    public Complaint() {}

    public Complaint(String complaintId, int userId, String title, String description, String category,
                     String priority, String status, String roomNumber, String assignedTo,
                     String adminRemarks, String resolutionDetails, Timestamp createdAt, Timestamp updatedAt) {
        this.complaintId = complaintId;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.roomNumber = roomNumber;
        this.assignedTo = assignedTo;
        this.adminRemarks = adminRemarks;
        this.resolutionDetails = resolutionDetails;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentIdStr() {
        return studentIdStr;
    }

    public void setStudentIdStr(String studentIdStr) {
        this.studentIdStr = studentIdStr;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }

    public String getResolutionDetails() {
        return resolutionDetails;
    }

    public void setResolutionDetails(String resolutionDetails) {
        this.resolutionDetails = resolutionDetails;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ComplaintImage> getImages() {
        return images;
    }

    public void setImages(List<ComplaintImage> images) {
        this.images = images;
    }

    public List<ComplaintHistory> getHistoryList() {
        return historyList;
    }

    public void setHistoryList(List<ComplaintHistory> historyList) {
        this.historyList = historyList;
    }
}
