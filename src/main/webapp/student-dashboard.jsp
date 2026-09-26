<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - Smart Hostel Complaints</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <nav class="navbar">
        <div class="navbar-brand">
            <span class="brand-icon">🏠</span> Smart Hostel Complaints
        </div>
        <ul class="nav-links">
            <li><a href="${pageContext.request.contextPath}/student/dashboard" class="nav-link active">Dashboard</a></li>
            <li><a href="${pageContext.request.contextPath}/student/complaint?action=history" class="nav-link">My Complaints</a></li>
            <li><a href="${pageContext.request.contextPath}/student/complaint?action=new" class="btn btn-primary btn-sm">+ New Complaint</a></li>
            <li class="user-badge">👤 <c:out value="${sessionScope.currentUser.name}"/></li>
            <li><a href="${pageContext.request.contextPath}/logout" class="btn btn-secondary btn-sm">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="glass-panel" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
                <h1 style="font-size: 1.8rem;">Welcome, <c:out value="${sessionScope.currentUser.name}"/> 👋</h1>
                <p style="color: var(--text-secondary); font-size: 0.95rem; margin-top: 4px;">
                    Student ID: <strong><c:out value="${sessionScope.currentUser.studentId}"/></strong> | Room: <strong><c:out value="${sessionScope.currentUser.roomNumber}"/></strong> | Dept: <strong><c:out value="${sessionScope.currentUser.department}"/></strong>
                </p>
            </div>
            <div>
                <a href="${pageContext.request.contextPath}/student/complaint?action=new" class="btn btn-primary">+ Submit Complaint</a>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Complaints</div>
                <div class="stat-number"><c:out value="${totalComplaints}"/></div>
            </div>
            <div class="stat-card">
                <div class="stat-label" style="color: var(--color-pending);">Pending</div>
                <div class="stat-number" style="background: linear-gradient(135deg, #fff, var(--color-pending)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><c:out value="${pendingComplaints}"/></div>
            </div>
            <div class="stat-card">
                <div class="stat-label" style="color: var(--color-progress);">In Progress</div>
                <div class="stat-number" style="background: linear-gradient(135deg, #fff, var(--color-progress)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><c:out value="${inProgressComplaints}"/></div>
            </div>
            <div class="stat-card">
                <div class="stat-label" style="color: var(--color-resolved);">Resolved</div>
                <div class="stat-number" style="background: linear-gradient(135deg, #fff, var(--color-resolved)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><c:out value="${resolvedComplaints}"/></div>
            </div>
        </div>

        <div class="glass-panel">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h2>Recent Complaints</h2>
                <a href="${pageContext.request.contextPath}/student/complaint?action=history" style="font-size: 0.9rem;">View All Complaints →</a>
            </div>

            <c:choose>
                <c:when test="${empty recentComplaints}">
                    <p style="color: var(--text-muted); padding: 20px 0; text-align: center;">No complaints submitted yet. Click <strong>Submit Complaint</strong> to register an issue.</p>
                </c:when>
                <c:otherwise>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach var="c" items="${recentComplaints}">
                                    <tr>
                                        <td><strong><c:out value="${c.complaintId}"/></strong></td>
                                        <td><c:out value="${c.title}"/></td>
                                        <td><c:out value="${c.category}"/></td>
                                        <td>
                                            <span class="badge badge-priority badge-${c.priority.toLowerCase()}">
                                                <c:out value="${c.priority}"/>
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge badge-${c.status.toLowerCase()}">
                                                <c:out value="${c.status}"/>
                                            </span>
                                        </td>
                                        <td><fmt:formatDate value="${c.createdAt}" pattern="yyyy-MM-dd HH:mm"/></td>
                                        <td>
                                            <a href="${pageContext.request.contextPath}/student/complaint?action=view&id=${c.complaintId}" class="btn btn-secondary btn-sm">View Details</a>
                                        </td>
                                    </tr>
                                </c:forEach>
                            </tbody>
                        </table>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>

</body>
</html>
