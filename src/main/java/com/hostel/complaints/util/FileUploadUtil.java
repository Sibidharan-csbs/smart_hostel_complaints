package com.hostel.complaints.util;

import jakarta.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class FileUploadUtil {

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    public static String getUploadDirectory() {
        String customDir = System.getenv("UPLOAD_DIR");
        if (customDir != null && !customDir.trim().isEmpty()) {
            File dir = new File(customDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            return dir.getAbsolutePath();
        }
        String userHome = System.getProperty("user.home");
        File defaultDir = new File(userHome, "hostel_complaint_uploads");
        if (!defaultDir.exists()) {
            defaultDir.mkdirs();
        }
        return defaultDir.getAbsolutePath();
    }

    public static String saveUploadedFile(Part part) throws IOException {
        if (part == null || part.getSize() == 0) {
            return null;
        }

        if (part.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 5 MB.");
        }

        String submittedFileName = Paths.get(part.getSubmittedFileName()).getFileName().toString();
        String extension = getFileExtension(submittedFileName).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Invalid file extension. Allowed extensions: " + ALLOWED_EXTENSIONS);
        }

        String contentType = part.getContentType();
        if (contentType != null && !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file MIME type. Allowed types: " + ALLOWED_MIME_TYPES);
        }

        String uniqueFileName = UUID.randomUUID().toString() + "." + extension;
        String uploadDirStr = getUploadDirectory();
        Path targetPath = Paths.get(uploadDirStr, uniqueFileName);

        try (InputStream inputStream = part.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        return uniqueFileName;
    }

    public static String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
            return fileName.substring(lastDotIndex + 1);
        }
        return "";
    }
}
