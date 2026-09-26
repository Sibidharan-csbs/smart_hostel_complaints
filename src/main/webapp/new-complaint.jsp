<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><c:choose><c:when test="${isEdit}">Edit Complaint</c:when><c:otherwise>Submit New Complaint</c:otherwise></c:choose> - Smart Hostel Complaints</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <nav class="navbar">
        <div class="navbar-brand">
            <span class="brand-icon">🏠</span> Smart Hostel Complaints
        </div>
        <ul class="nav-links">
            <li><a href="${pageContext.request.contextPath}/student/dashboard" class="nav-link">Dashboard</a></li>
            <li><a href="${pageContext.request.contextPath}/student/complaint?action=history" class="nav-link">My Complaints</a></li>
            <li class="user-badge">👤 <c:out value="${sessionScope.currentUser.name}"/></li>
            <li><a href="${pageContext.request.contextPath}/logout" class="btn btn-secondary btn-sm">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="glass-panel" style="max-width: 720px; margin: 0 auto;">
            <h2 style="font-size: 1.8rem; margin-bottom: 8px;">
                <c:choose>
                    <c:when test="${isEdit}">Edit Pending Complaint (${complaint.complaintId})</c:when>
                    <c:otherwise>Submit New Hostel Complaint</c:otherwise>
                </c:choose>
            </h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.9rem;">
                Fill in the details below. Our maintenance team will inspect and resolve your issue.
            </p>

            <c:if test="${not empty errorMessage}">
                <div class="alert alert-danger">
                    <span>⚠️</span> <c:out value="${errorMessage}"/>
                </div>
            </c:if>

            <form action="${pageContext.request.contextPath}/student/complaint" method="post" enctype="multipart/form-data">
                <input type="hidden" name="csrfToken" value="${csrfToken}"/>
                <input type="hidden" name="action" value="<c:choose><c:when test="${isEdit}">update</c:when><c:otherwise>create</c:otherwise></c:choose>"/>
                <c:if test="${isEdit}">
                    <input type="hidden" name="complaintId" value="${complaint.complaintId}"/>
                </c:if>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label for="category" class="form-label">Category *</label>
                        <select id="category" name="category" class="form-control" required>
                            <option value="">Select Category</option>
                            <option value="Plumbing" <c:if test="${(isEdit ? complaint.category : category) == 'Plumbing'}">selected</c:if>>Plumbing</option>
                            <option value="Electrical" <c:if test="${(isEdit ? complaint.category : category) == 'Electrical'}">selected</c:if>>Electrical</option>
                            <option value="Wi-Fi" <c:if test="${(isEdit ? complaint.category : category) == 'Wi-Fi'}">selected</c:if>>Wi-Fi & Network</option>
                            <option value="Cleaning" <c:if test="${(isEdit ? complaint.category : category) == 'Cleaning'}">selected</c:if>>Cleaning & Hygiene</option>
                            <option value="Furniture" <c:if test="${(isEdit ? complaint.category : category) == 'Furniture'}">selected</c:if>>Furniture & Carpentry</option>
                            <option value="Other" <c:if test="${(isEdit ? complaint.category : category) == 'Other'}">selected</c:if>>Other Issue</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="priority" class="form-label">Priority Level *</label>
                        <select id="priority" name="priority" class="form-control" required>
                            <option value="LOW" <c:if test="${(isEdit ? complaint.priority : priority) == 'LOW'}">selected</c:if>>Low Priority</option>
                            <option value="MEDIUM" <c:if test="${empty (isEdit ? complaint.priority : priority) || (isEdit ? complaint.priority : priority) == 'MEDIUM'}">selected</c:if>>Medium Priority</option>
                            <option value="HIGH" <c:if test="${(isEdit ? complaint.priority : priority) == 'HIGH'}">selected</c:if>>High Priority / Urgent</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label for="title" class="form-label">Complaint Title *</label>
                        <input type="text" id="title" name="title" class="form-control" placeholder="e.g. Water leakage in bathroom sink" value="<c:out value="${isEdit ? complaint.title : title}"/>" required>
                    </div>

                    <div class="form-group">
                        <label for="roomNumber" class="form-label">Room Number *</label>
                        <input type="text" id="roomNumber" name="roomNumber" class="form-control" placeholder="e.g. B-204" value="<c:out value="${isEdit ? complaint.roomNumber : (empty roomNumber ? sessionScope.currentUser.roomNumber : roomNumber)}"/>" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="description" class="form-label">Detailed Description *</label>
                    <textarea id="description" name="description" class="form-control" placeholder="Provide a detailed description of the issue..." required><c:out value="${isEdit ? complaint.description : description}"/></textarea>
                </div>

                <div class="form-group">
                    <label for="images" class="form-label">Upload Images (Optional - JPG, PNG, WEBP, max 5MB each)</label>
                    <input type="file" id="images" name="images" class="form-control" accept="image/jpeg,image/png,image/webp" multiple>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">
                        <c:choose>
                            <c:when test="${isEdit}">Save Changes</c:when>
                            <c:otherwise>Submit Complaint</c:otherwise>
                        </c:choose>
                    </button>
                    <a href="${pageContext.request.contextPath}/student/complaint?action=history" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>

</body>
</html>
