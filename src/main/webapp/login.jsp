<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Smart Hostel Complaints</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <div class="auth-wrapper">
        <div class="glass-panel auth-card">
            <div class="auth-header">
                <h2 class="auth-title">Welcome Back</h2>
                <p class="auth-subtitle">Login to access your hostel complaint account</p>
            </div>

            <c:if test="${not empty errorMessage}">
                <div class="alert alert-danger">
                    <span>⚠️</span> <c:out value="${errorMessage}"/>
                </div>
            </c:if>

            <c:if test="${not empty successMessage}">
                <div class="alert alert-success">
                    <span>✅</span> <c:out value="${successMessage}"/>
                </div>
            </c:if>

            <form action="${pageContext.request.contextPath}/login" method="post">
                <input type="hidden" name="csrfToken" value="${csrfToken}"/>

                <div class="form-group">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="e.g. student@hostel.com or admin@hostel.com" value="${email}" required>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" name="password" class="form-control" placeholder="Enter your password" required>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px; padding: 12px;">Sign In</button>
            </form>

            <div style="text-align: center; margin-top: 24px; color: var(--text-secondary); font-size: 0.9rem;">
                New student? <a href="${pageContext.request.contextPath}/register">Register here</a>
            </div>
            <div style="text-align: center; margin-top: 12px;">
                <a href="${pageContext.request.contextPath}/" style="font-size: 0.85rem; color: var(--text-muted);">← Back to Home</a>
            </div>
        </div>
    </div>

</body>
</html>
