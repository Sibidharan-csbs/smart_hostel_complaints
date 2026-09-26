# 🏠 Smart Hostel Complaint Management System

A production-ready, secure web application built using **Core Java 17+**, **Jakarta Servlets 6.0**, **JSP 3.1 & JSTL 3.0**, **JDBC**, and **MySQL 8**, designed for deployment on **Apache Tomcat 10.1**.

---

## 📖 Project Overview

The **Smart Hostel Complaint Management System** enables hostel students to report hostel-related maintenance issues (plumbing, electrical, Wi-Fi, cleaning, furniture, etc.) online with image attachments and track resolution progress in real time. Hostel administrators can efficiently manage, search, filter, assign maintenance staff, update status, add resolution remarks, and oversee student records through an interactive dashboard.

---

## 🛠️ Technology Stack

- **Java**: Java 17+
- **Server-Side API**: Jakarta Servlet API 6.0 (`jakarta.servlet.*`)
- **Template Engine**: JSP 3.1 & JSTL 3.0
- **Database Access**: JDBC with `PreparedStatement` & Transactions
- **Database**: MySQL 8.0+
- **Security**: BCrypt Password Hashing (`at.favre.lib:bcrypt`), Session Authentication, Role-based Access Control, CSRF Tokens, Path Traversal Protection
- **Web Server**: Apache Tomcat 10.1+
- **Build Tool**: Apache Maven (`pom.xml`)
- **Frontend**: HTML5 & CSS3 (Pure server-side rendering, zero JavaScript)

---

## 📂 Project Structure

```
smart_hostel_complaints/
├── pom.xml
├── schema.sql
├── README.md
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── hostel/
        │           └── complaints/
        │               ├── controller/
        │               │   ├── AdminComplaintServlet.java
        │               │   ├── AdminDashboardServlet.java
        │               │   ├── ComplaintServlet.java
        │               │   ├── ImageServlet.java
        │               │   ├── LoginServlet.java
        │               │   ├── LogoutServlet.java
        │               │   ├── RegisterServlet.java
        │               │   └── StudentDashboardServlet.java
        │               ├── dao/
        │               │   ├── ComplaintDAO.java
        │               │   ├── ComplaintHistoryDAO.java
        │               │   ├── DBConnection.java
        │               │   └── UserDAO.java
        │               ├── filter/
        │               │   ├── AdminAuthorizationFilter.java
        │               │   └── AuthenticationFilter.java
        │               ├── listener/
        │               │   └── ApplicationContextListener.java
        │               ├── model/
        │               │   ├── Complaint.java
        │               │   ├── ComplaintHistory.java
        │               │   ├── ComplaintImage.java
        │               │   └── User.java
        │               └── util/
        │                   ├── CSRFUtil.java
        │                   ├── FileUploadUtil.java
        │                   └── PasswordUtil.java
        └── webapp/
            ├── index.jsp
            ├── login.jsp
            ├── register.jsp
            ├── student-dashboard.jsp
            ├── new-complaint.jsp
            ├── complaint-history.jsp
            ├── complaint-details.jsp
            ├── admin-dashboard.jsp
            ├── admin-complaints.jsp
            ├── css/
            │   └── style.css
            └── WEB-INF/
                └── web.xml
```

---

## 🔒 Test Accounts

The system automatically initializes default sample accounts on database setup:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@hostel.com` | `Admin@123` | Full access to Admin Dashboard, staff assignment & complaint management |
| **Student** | `student@hostel.com` | `Student@123` | Student Dashboard, complaint submission, tracking & history |

---

## 🚀 Step-by-Step Setup & Running Guide

### 1. Prerequisites
- **JDK**: Java Development Kit 17 or higher (`java -version`)
- **MySQL Server**: MySQL 8.0 or higher
- **Web Server**: Apache Tomcat 10.1+
- **Maven**: Apache Maven 3.8+ (`mvn -version`)

### 2. Configure MySQL Database
Start MySQL Server and execute the database script:

```sql
mysql -u root -p < schema.sql
```

Alternatively, run MySQL workbench/CLI and execute `schema.sql`.

#### Custom Database Credentials (Optional)
If your MySQL username or password differs from default (`root`/`root`), set environment variables:
- `DB_URL`: `jdbc:mysql://localhost:3306/hostel_complaints?useSSL=false`
- `DB_USER`: `your_mysql_username`
- `DB_PASS`: `your_mysql_password`

### 3. Build WAR Packaging
Navigate to the project directory and package the web application using Maven:

```bash
mvn clean package
```

This compiles all Java classes, executes validation checks, and creates `target/hostel-complaints.war`.

### 4. Deploy to Apache Tomcat 10.1
1. Copy `target/hostel-complaints.war` to your Tomcat `webapps/` directory:
   ```bash
   cp target/hostel-complaints.war /path/to/apache-tomcat-10.1.x/webapps/
   ```
2. Start Tomcat:
   - **Linux/macOS**: `./bin/startup.sh`
   - **Windows**: `.\bin\startup.bat`

### 5. Access Application
Open your web browser and navigate to:
```
http://localhost:8080/hostel-complaints/
```

---

## 🧪 Functionality Testing Checklist

### Student Workflow
1. Navigate to `/register` and create a student account with Student ID, Name, Email, Password, Department, and Room.
2. Login at `/login` using student credentials.
3. Access Student Dashboard (`/student/dashboard`) to view statistics.
4. Click **+ Submit Complaint** to submit a complaint with title, description, category, priority, room number, and photo upload.
5. Track complaint status in **My Complaint History** (`/student/complaint?action=history`).
6. Click **View Details** to inspect timeline history and resolution feedback.
7. Edit or cancel a pending complaint before admin processing.

### Administrator Workflow
1. Log in with `admin@hostel.com` / `Admin@123`.
2. View real-time calculated statistics on **Admin Dashboard** (`/admin/dashboard`):
   - Total Complaints
   - Pending Complaints
   - Assigned Complaints
   - In-Progress Complaints
   - Resolved Complaints
   - Overdue Complaints (>48 hours)
3. Access **All Complaints** (`/admin/complaint?action=list`) to search by Complaint ID, Student Name, or Room Number.
4. Filter complaints by status, category, or priority.
5. Click **Manage** to assign maintenance staff (e.g., Electrician, Plumber), update status to `IN_PROGRESS` or `RESOLVED`, and add resolution remarks.
6. Delete invalid complaints using the admin delete action.

---

## 📄 License
Educational & Academic Project.
