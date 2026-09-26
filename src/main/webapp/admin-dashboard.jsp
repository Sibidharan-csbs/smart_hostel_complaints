<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Smart Hostel Complaints</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <nav class="navbar">
        <div class="navbar-brand">
            <span class="brand-icon">🏠</span> Smart Hostel Complaints (Admin)
        </div>
        <ul class="nav-links">
            <li><a href="${pageContext.request.contextPath}/admin/dashboard" class="nav-link active">Dashboard</a></li>
            <li><a href="${pageContext.request.contextPath}/admin/complaint?action=list" class="nav-link">All Complaints</a></li>
            <li class="user-badge">👑 Administrator</li>
            <li><a href="${pageContext.request.contextPath}/logout" class="btn btn-secondary btn-sm">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="glass-panel" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
            <div>
                <h1 style="font-size: 1.8rem;">Administrator Control Panel 🛡️</h1>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">Monitor hostel issues, assign staff, and track resolution metrics</p>
            </div>
            <div>
                <a href="${pageContext.request.contextPath}/admin/complaint?action=list" class="btn btn-primary">Manage All Complaints</a>
            </div>
        </div>

        <!-- Dashboard Statistics Cards (Module 3 requirement) -->
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));">
            <div class="stat-card">
                <div class="stat-label">Total Complaints</div>
                <div class="stat-number"><c:out value="${stats.TOTAL}"/></div>
            </div>
            <div class="stat-card">
                <div class="stat-label" style="color: var(--color-pending);">Pending</div>
                <div class="stat-number" style="background: linear-gradient(135deg, #fff, var(--color-pending)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><c:out value="${stats.PENDING}"/></div>
            </div>
            <div class="stat-card">
                <div class="stat-label" style="color: var(--color-assigned);">Assigned</div>
                <div class="stat-number" style="background: linear-gradient(135deg, #fff, var(--color-assigned)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><c:out value="${stats.ASSIGNED}"/></div>
            </div>
            <div class="stat-card">
                <div class="stat-label" style="color: var(--color-progress);">In Progress</div>
                <div class="stat-number" style="background: linear-gradient(135deg, #fff, var(--color-progress)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><c:out value="${stats.IN_PROGRESS}"/></div>
            </div>
            <div class="stat-card">
                <div class="stat-label" style="color: var(--color-resolved);">Resolved</div>
                <div class="stat-number" style="background: linear-gradient(135deg, #fff, var(--color-resolved)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><c:out value="${stats.RESOLVED}"/></div>
            </div>
            <div class="stat-card">
                <div class="stat-label" style="color: var(--color-rejected);">Overdue (>48h)</div>
                <div class="stat-number" style="background: linear-gradient(135deg, #fff, var(--color-rejected)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><c:out value="${stats.OVERDUE}"/></div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
            <!-- Recent Complaints -->
            <div class="glass-panel">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h2>Recent Complaints</h2>
                    <a href="${pageContext.request.contextPath}/admin/complaint?action=list" style="font-size: 0.9rem;">View All →</a>
                </div>

                <c:choose>
                    <c:when test="${empty recentComplaints}">
                        <p style="color: var(--text-muted); text-align: center; padding: 20px 0;">No complaints recorded yet.</p>
                    </c:when>
                    <c:otherwise>
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Student</th>
                                        <th>Room</th>
                                        <th>Category</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="c" items="${recentComplaints}">
                                        <tr>
                                            <td><strong><c:out value="${c.complaintId}"/></strong></td>
                                            <td><c:out value="${c.studentName}"/></td>
                                            <td><c:out value="${c.roomNumber}"/></td>
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
                                            <td>
                                                <a href="${pageContext.request.contextPath}/admin/complaint?action=view&id=${c.complaintId}" class="btn btn-secondary btn-sm">Manage</a>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>

            <!-- Registered Students List -->
            <div class="glass-panel">
                <h2 style="font-size: 1.2rem; margin-bottom: 16px;">Registered Student Records</h2>
                <c:choose>
                    <c:when test="${empty students}">
                        <p style="color: var(--text-muted); font-size: 0.9rem;">No registered students found.</p>
                    </c:when>
                    <c:otherwise>
                        <div class="table-container" style="max-height: 380px; overflow-y: auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Room</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="s" items="${students}">
                                        <tr>
                                            <td><strong><c:out value="${s.studentId}"/></strong></td>
                                            <td><c:out value="${s.name}"/></td>
                                            <td><c:out value="${s.roomNumber}"/></td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>
    </div>

</body>
</html>
