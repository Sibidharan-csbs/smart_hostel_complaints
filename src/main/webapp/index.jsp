<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Hostel Complaints System</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <nav class="navbar">
        <div class="navbar-brand">
            <span class="brand-icon">🏠</span> Smart Hostel Complaints
        </div>
        <ul class="nav-links">
            <c:choose>
                <c:when test="${not empty sessionScope.currentUser}">
                    <c:choose>
                        <c:when test="${sessionScope.currentUser.admin}">
                            <li><a href="${pageContext.request.contextPath}/admin/dashboard" class="nav-link">Admin Dashboard</a></li>
                            <li><a href="${pageContext.request.contextPath}/admin/complaint?action=list" class="nav-link">All Complaints</a></li>
                        </c:when>
                        <c:otherwise>
                            <li><a href="${pageContext.request.contextPath}/student/dashboard" class="nav-link">Dashboard</a></li>
                            <li><a href="${pageContext.request.contextPath}/student/complaint?action=history" class="nav-link">My Complaints</a></li>
                        </c:otherwise>
                    </c:choose>
                    <li class="user-badge">👤 <c:out value="${sessionScope.currentUser.name}"/></li>
                    <li><a href="${pageContext.request.contextPath}/logout" class="btn btn-secondary btn-sm">Logout</a></li>
                </c:when>
                <c:otherwise>
                    <li><a href="${pageContext.request.contextPath}/login" class="nav-link">Login</a></li>
                    <li><a href="${pageContext.request.contextPath}/register" class="btn btn-primary btn-sm">Register</a></li>
                </c:otherwise>
            </c:choose>
        </ul>
    </nav>

    <div class="container" style="margin-top: 40px;">
        <div class="glass-panel" style="text-align: center; padding: 60px 40px;">
            <h1 style="font-size: 2.8rem; margin-bottom: 16px; background: linear-gradient(135deg, #fff, var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Smart Hostel Complaint Management System
            </h1>
            <p style="color: var(--text-secondary); font-size: 1.1rem; max-width: 700px; margin: 0 auto 32px auto; line-height: 1.6;">
                Streamlining hostel maintenance and student complaint resolution. Submit complaints digitally, attach photos, track real-time resolution status, and maintain complete transparency.
            </p>
            <div style="display: flex; gap: 16px; justify-content: center;">
                <c:choose>
                    <c:when test="${not empty sessionScope.currentUser}">
                        <c:choose>
                            <c:when test="${sessionScope.currentUser.admin}">
                                <a href="${pageContext.request.contextPath}/admin/dashboard" class="btn btn-primary">Go to Admin Dashboard</a>
                            </c:when>
                            <c:otherwise>
                                <a href="${pageContext.request.contextPath}/student/dashboard" class="btn btn-primary">Go to Dashboard</a>
                                <a href="${pageContext.request.contextPath}/student/complaint?action=new" class="btn btn-secondary">Submit New Complaint</a>
                            </c:otherwise>
                        </c:choose>
                    </c:when>
                    <c:otherwise>
                        <a href="${pageContext.request.contextPath}/login" class="btn btn-primary">Student / Admin Login</a>
                        <a href="${pageContext.request.contextPath}/register" class="btn btn-secondary">Student Registration</a>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>

        <div class="stats-grid" style="margin-top: 40px;">
            <div class="stat-card">
                <div style="font-size: 2rem;">🔧</div>
                <div class="stat-number">Plumbing & Electric</div>
                <div class="stat-label">Fast Maintenance</div>
            </div>
            <div class="stat-card">
                <div style="font-size: 2rem;">📶</div>
                <div class="stat-number">Wi-Fi & Network</div>
                <div class="stat-label">Quick Resolution</div>
            </div>
            <div class="stat-card">
                <div style="font-size: 2rem;">📸</div>
                <div class="stat-number">Image Proof</div>
                <div class="stat-label">Visual Complaints</div>
            </div>
            <div class="stat-card">
                <div style="font-size: 2rem;">📊</div>
                <div class="stat-number">Live Status</div>
                <div class="stat-label">Real-time Updates</div>
            </div>
        </div>
    </div>

</body>
</html>
