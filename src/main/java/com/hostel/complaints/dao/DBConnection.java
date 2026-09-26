package com.hostel.complaints.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DBConnection {

    private static final Logger LOGGER = Logger.getLogger(DBConnection.class.getName());

    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/hostel_complaints?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASS = "root";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "MySQL JDBC Driver not found in classpath!", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        String dbUrl = System.getenv("DB_URL");
        if (dbUrl == null || dbUrl.trim().isEmpty()) {
            dbUrl = DEFAULT_URL;
        }

        String dbUser = System.getenv("DB_USER");
        if (dbUser == null || dbUser.trim().isEmpty()) {
            dbUser = DEFAULT_USER;
        }

        String dbPass = System.getenv("DB_PASS");
        if (dbPass == null) {
            dbPass = DEFAULT_PASS;
        }

        return DriverManager.getConnection(dbUrl, dbUser, dbPass);
    }
}
