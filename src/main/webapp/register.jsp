<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Registration - Smart Hostel Complaints</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <div class="auth-wrapper">
        <div class="glass-panel auth-card" style="max-width: 560px;">
            <div class="auth-header">
                <h2 class="auth-title">Student Registration</h2>
                <p class="auth-subtitle">Create an account to submit and track hostel complaints</p>
            </div>

            <c:if test="${not empty errorMessage}">
                <div class="alert alert-danger">
                    <span>⚠️</span> <c:out value="${errorMessage}"/>
                </div>
            </c:if>

            <form action="${pageContext.request.contextPath}/register" method="post">
                <input type="hidden" name="csrfToken" value="${csrfToken}"/>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label for="name" class="form-label">Full Name</label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="John Doe" value="${name}" required>
                    </div>

                    <div class="form-group">
                        <label for="studentId" class="form-label">Student ID / Roll No</label>
                        <input type="text" id="studentId" name="studentId" class="form-control" placeholder="STU1001" value="${studentId}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="john.doe@hostel.com" value="${email}" required>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label for="department" class="form-label">Department</label>
                        <input type="text" id="department" name="department" class="form-control" placeholder="Computer Science" value="${department}" required>
                    </div>

                    <div class="form-group">
                        <label for="roomNumber" class="form-label">Hostel Room Number</label>
                        <input type="text" id="roomNumber" name="roomNumber" class="form-control" placeholder="B-204" value="${roomNumber}" required>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" id="password" name="password" class="form-control" placeholder="At least 6 chars" required>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" placeholder="Re-enter password" required>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px; padding: 12px;">Create Account</button>
            </form>

            <div style="text-align: center; margin-top: 24px; color: var(--text-secondary); font-size: 0.9rem;">
                Already have an account? <a href="${pageContext.request.contextPath}/login">Login here</a>
            </div>
            <div style="text-align: center; margin-top: 12px;">
                <a href="${pageContext.request.contextPath}/" style="font-size: 0.85rem; color: var(--text-muted);">← Back to Home</a>
            </div>
        </div>
    </div>

</body>
</html>
