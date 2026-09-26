package com.hostel.complaints.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class ComplaintImage implements Serializable {
    private static final long serialVersionUID = 1L;

    private int imageId;
    private String complaintId;
    private String fileName;
    private String filePath;
    private Timestamp uploadedAt;

    public ComplaintImage() {}

    public ComplaintImage(int imageId, String complaintId, String fileName, String filePath, Timestamp uploadedAt) {
        this.imageId = imageId;
        this.complaintId = complaintId;
        this.fileName = fileName;
        this.filePath = filePath;
        this.uploadedAt = uploadedAt;
    }

    public int getImageId() {
        return imageId;
    }

    public void setImageId(int imageId) {
        this.imageId = imageId;
    }

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Timestamp getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Timestamp uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
