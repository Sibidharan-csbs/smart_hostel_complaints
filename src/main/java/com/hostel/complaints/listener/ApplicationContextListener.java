package com.hostel.complaints.listener;

import com.hostel.complaints.dao.DBConnection;
import com.hostel.complaints.dao.UserDAO;
import com.hostel.complaints.model.User;
import com.hostel.complaints.util.PasswordUtil;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import java.sql.Connection;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebListener
public class ApplicationContextListener implements ServletContextListener {

    private static final Logger LOGGER = Logger.getLogger(ApplicationContextListener.class.getName());

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        LOGGER.info("Initializing Smart Hostel Complaint Management System...");

        try (Connection conn = DBConnection.getConnection()) {
            LOGGER.info("Database connection successfully established!");
            seedInitialAdminAccount();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to connect or initialize database during web application startup", e);
        }
    }

    private void seedInitialAdminAccount() {
        UserDAO userDAO = new UserDAO();
        if (!userDAO.emailExists("admin@hostel.com")) {
            User admin = new User();
            admin.setName("Hostel Administrator");
            admin.setStudentId("ADMIN001");
            admin.setEmail("admin@hostel.com");
            admin.setPassword(PasswordUtil.hashPassword("Admin@123"));
            admin.setRole("ADMIN");
            admin.setDepartment("Hostel Management");
            admin.setRoomNumber("A-101");

            if (userDAO.registerUser(admin)) {
                LOGGER.info("Default Administrator account created successfully: admin@hostel.com");
            } else {
                LOGGER.warning("Failed to seed initial Administrator account!");
            }
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        LOGGER.info("Smart Hostel Complaint Management System context destroyed.");
    }
}
