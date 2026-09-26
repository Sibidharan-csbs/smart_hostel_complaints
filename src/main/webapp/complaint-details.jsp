<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complaint Details - ${complaint.complaintId}</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <nav class="navbar">
        <div class="navbar-brand">
            <span class="brand-icon">🏠</span> Smart Hostel Complaints
        </div>
        <ul class="nav-links">
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
        </ul>
    </nav>

    <div class="container">
        <c:if test="${not empty sessionScope.successMessage}">
            <div class="alert alert-success">
                <span>✅</span> <c:out value="${sessionScope.successMessage}"/>
            </div>
            <c:remove var="successMessage" scope="session"/>
        </c:if>

        <c:if test="${not empty sessionScope.errorMessage}">
            <div class="alert alert-danger">
                <span>⚠️</span> <c:out value="${sessionScope.errorMessage}"/>
            </div>
            <c:remove var="errorMessage" scope="session"/>
        </c:if>

        <div style="margin-bottom: 16px;">
            <c:choose>
                <c:when test="${sessionScope.currentUser.admin}">
                    <a href="${pageContext.request.contextPath}/admin/complaint?action=list" class="btn btn-secondary btn-sm">← Back to Complaints List</a>
                </c:when>
                <c:otherwise>
                    <a href="${pageContext.request.contextPath}/student/complaint?action=history" class="btn btn-secondary btn-sm">← Back to History</a>
                </c:otherwise>
            </c:choose>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
            <!-- Left Column: Complaint Main Info -->
            <div>
                <div class="glass-panel">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <span style="font-size: 0.85rem; color: var(--text-muted);">Complaint Reference: <strong><c:out value="${complaint.complaintId}"/></strong></span>
                            <h1 style="font-size: 1.8rem; margin-top: 4px;"><c:out value="${complaint.title}"/></h1>
                        </div>
                        <span class="badge badge-${complaint.status.toLowerCase()}" style="font-size: 0.9rem; padding: 6px 14px;">
                            <c:out value="${complaint.status}"/>
                        </span>
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
                        <span class="badge badge-priority badge-${complaint.priority.toLowerCase()}">
                            Priority: <c:out value="${complaint.priority}"/>
                        </span>
                        <span class="btn btn-secondary btn-sm" style="cursor: default;">
                            📁 Category: <c:out value="${complaint.category}"/>
                        </span>
                        <span class="btn btn-secondary btn-sm" style="cursor: default;">
                            📍 Room: <c:out value="${complaint.roomNumber}"/>
                        </span>
                    </div>

                    <h3 style="font-size: 1.1rem; margin-bottom: 8px;">Description</h3>
                    <div style="background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); line-height: 1.6; white-space: pre-wrap; margin-bottom: 24px;">
                        <c:out value="${complaint.description}"/>
                    </div>

                    <c:if test="${not empty complaint.images}">
                        <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Attached Images</h3>
                        <div class="image-gallery" style="margin-bottom: 24px;">
                            <c:forEach var="img" items="${complaint.images}">
                                <div class="image-card">
                                    <a href="${pageContext.request.contextPath}/image?name=${img.fileName}" target="_blank">
                                        <img src="${pageContext.request.contextPath}/image?name=${img.fileName}" alt="Complaint image">
                                    </a>
                                </div>
                            </c:forEach>
                        </div>
                    </c:if>

                    <c:if test="${not empty complaint.assignedTo || not empty complaint.adminRemarks || not empty complaint.resolutionDetails}">
                        <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Resolution & Admin Feedback</h3>
                        <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid var(--border-glow); padding: 16px; border-radius: var(--radius-md);">
                            <c:if test="${not empty complaint.assignedTo}">
                                <p style="margin-bottom: 8px;">👨‍🔧 <strong>Assigned Maintenance Staff:</strong> <c:out value="${complaint.assignedTo}"/></p>
                            </c:if>
                            <c:if test="${not empty complaint.adminRemarks}">
                                <p style="margin-bottom: 8px;">💬 <strong>Admin Remarks:</strong> <c:out value="${complaint.adminRemarks}"/></p>
                            </c:if>
                            <c:if test="${not empty complaint.resolutionDetails}">
                                <p>✅ <strong>Resolution Details:</strong> <c:out value="${complaint.resolutionDetails}"/></p>
                            </c:if>
                        </div>
                    </c:if>
                </div>

                <!-- Admin Action Card -->
                <c:if test="${sessionScope.currentUser.admin}">
                    <div class="glass-panel">
                        <h2 style="font-size: 1.3rem; margin-bottom: 16px;">Update Complaint & Assign Staff</h2>
                        <form action="${pageContext.request.contextPath}/admin/complaint" method="post">
                            <input type="hidden" name="csrfToken" value="${csrfToken}"/>
                            <input type="hidden" name="action" value="updateStatus"/>
                            <input type="hidden" name="complaintId" value="${complaint.complaintId}"/>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div class="form-group">
                                    <label for="status" class="form-label">Status</label>
                                    <select id="status" name="status" class="form-control" required>
                                        <option value="PENDING" <c:if test="${complaint.status == 'PENDING'}">selected</c:if>>Pending</option>
                                        <option value="ASSIGNED" <c:if test="${complaint.status == 'ASSIGNED'}">selected</c:if>>Assigned</option>
                                        <option value="IN_PROGRESS" <c:if test="${complaint.status == 'IN_PROGRESS'}">selected</c:if>>In Progress</option>
                                        <option value="RESOLVED" <c:if test="${complaint.status == 'RESOLVED'}">selected</c:if>>Resolved</option>
                                        <option value="REJECTED" <c:if test="${complaint.status == 'REJECTED'}">selected</c:if>>Rejected</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="assignedTo" class="form-label">Assign Maintenance Staff</label>
                                    <input type="text" id="assignedTo" name="assignedTo" class="form-control" placeholder="e.g. Electrician Raj" value="<c:out value="${complaint.assignedTo}"/>">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="adminRemarks" class="form-label">Admin Remarks</label>
                                <input type="text" id="adminRemarks" name="adminRemarks" class="form-control" placeholder="Internal or student-facing notes" value="<c:out value="${complaint.adminRemarks}"/>">
                            </div>

                            <div class="form-group">
                                <label for="resolutionDetails" class="form-label">Resolution Details</label>
                                <textarea id="resolutionDetails" name="resolutionDetails" class="form-control" placeholder="Provide complete resolution steps taken..."><c:out value="${complaint.resolutionDetails}"/></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%;">Update Status & Save Remarks</button>
                        </form>
                    </div>
                </c:if>
            </div>

            <!-- Right Column: Student Info & History Timeline -->
            <div>
                <div class="glass-panel">
                    <h3 style="font-size: 1.1rem; margin-bottom: 16px;">Student Record</h3>
                    <p style="margin-bottom: 8px;">👤 <strong>Name:</strong> <c:out value="${complaint.studentName}"/></p>
                    <p style="margin-bottom: 8px;">🆔 <strong>Student ID:</strong> <c:out value="${complaint.studentIdStr}"/></p>
                    <p style="margin-bottom: 8px;">🚪 <strong>Room No:</strong> <c:out value="${complaint.roomNumber}"/></p>
                    <p style="margin-bottom: 8px;">📅 <strong>Submitted:</strong> <fmt:formatDate value="${complaint.createdAt}" pattern="yyyy-MM-dd HH:mm"/></p>
                    <p>🕒 <strong>Last Updated:</strong> <fmt:formatDate value="${complaint.updatedAt}" pattern="yyyy-MM-dd HH:mm"/></p>
                </div>

                <div class="glass-panel">
                    <h3 style="font-size: 1.1rem; margin-bottom: 16px;">Status History</h3>
                    <c:choose>
                        <c:when test="${empty complaint.historyList}">
                            <p style="color: var(--text-muted); font-size: 0.85rem;">No history records available.</p>
                        </c:when>
                        <c:otherwise>
                            <div class="timeline">
                                <c:forEach var="h" items="${complaint.historyList}">
                                    <div class="timeline-item">
                                        <div class="timeline-meta">
                                            <fmt:formatDate value="${h.updatedAt}" pattern="yyyy-MM-dd HH:mm"/> | By <c:out value="${h.updatedBy}"/>
                                        </div>
                                        <div class="timeline-content">
                                            Status: <span class="badge badge-${h.newStatus.toLowerCase()}"><c:out value="${h.newStatus}"/></span>
                                            <c:if test="${not empty h.remarks}">
                                                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
                                                    <c:out value="${h.remarks}"/>
                                                </div>
                                            </c:if>
                                        </div>
                                    </div>
                                </c:forEach>
                            </div>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
