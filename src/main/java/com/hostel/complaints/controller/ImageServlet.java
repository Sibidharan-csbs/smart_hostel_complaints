package com.hostel.complaints.controller;

import com.hostel.complaints.util.FileUploadUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

@WebServlet("/image")
public class ImageServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        if (name == null || name.trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Image name is required.");
            return;
        }

        String uploadDirStr = FileUploadUtil.getUploadDirectory();
        File baseDir = new File(uploadDirStr);
        File imageFile = new File(baseDir, name.trim());

        // Path Traversal Security Check
        if (!imageFile.getCanonicalPath().startsWith(baseDir.getCanonicalPath())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied.");
            return;
        }

        if (!imageFile.exists() || !imageFile.isFile()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Image not found.");
            return;
        }

        String contentType = getServletContext().getMimeType(imageFile.getName());
        if (contentType == null) {
            String ext = FileUploadUtil.getFileExtension(imageFile.getName()).toLowerCase();
            if ("jpg".equals(ext) || "jpeg".equals(ext)) contentType = "image/jpeg";
            else if ("png".equals(ext)) contentType = "image/png";
            else if ("webp".equals(ext)) contentType = "image/webp";
            else contentType = "application/octet-stream";
        }

        response.setContentType(contentType);
        response.setContentLengthLong(imageFile.length());

        try (FileInputStream in = new FileInputStream(imageFile);
             OutputStream out = response.getOutputStream()) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        }
    }
}
