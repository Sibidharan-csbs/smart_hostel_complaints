<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complaint History - Smart Hostel Complaints</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <nav class="navbar">
        <div class="navbar-brand">
            <span class="brand-icon">🏠</span> Smart Hostel Complaints
        </div>
        <ul class="nav-links">
            <li><a href="${pageContext.request.contextPath}/student/dashboard" class="nav-link">Dashboard</a></li>
            <li><a href="${pageContext.request.contextPath}/student/complaint?action=history" class="nav-link active">My Complaints</a></li>
            <li><a href="${pageContext.request.contextPath}/student/complaint?action=new" class="btn btn-primary btn-sm">+ New Complaint</a></li>
            <li class="user-badge">👤 <c:out value="${sessionScope.currentUser.name}"/></li>
            <li><a href="${pageContext.request.contextPath}/logout" class="btn btn-secondary btn-sm">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="glass-panel">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
                <div>
                    <h2>My Complaint History</h2>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">View, track status, edit, or cancel your submitted complaints</p>
                </div>
                <a href="${pageContext.request.contextPath}/student/complaint?action=new" class="btn btn-primary">+ New Complaint</a>
            </div>

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

            <form action="${pageContext.request.contextPath}/student/complaint" method="get" class="filter-bar">
                <input type="hidden" name="action" value="history"/>

                <input type="text" name="search" class="form-control" placeholder="Search ID, title..." value="<c:out value="${search}"/>">

                <select name="status" class="form-control">
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING" <c:if test="${status == 'PENDING'}">selected</c:if>>Pending</option>
                    <option value="ASSIGNED" <c:if test="${status == 'ASSIGNED'}">selected</c:if>>Assigned</option>
                    <option value="IN_PROGRESS" <c:if test="${status == 'IN_PROGRESS'}">selected</c:if>>In Progress</option>
                    <option value="RESOLVED" <c:if test="${status == 'RESOLVED'}">selected</c:if>>Resolved</option>
                    <option value="REJECTED" <c:if test="${status == 'REJECTED'}">selected</c:if>>Rejected</option>
                </select>

                <select name="category" class="form-control">
                    <option value="ALL">All Categories</option>
                    <option value="Plumbing" <c:if test="${category == 'Plumbing'}">selected</c:if>>Plumbing</option>
                    <option value="Electrical" <c:if test="${category == 'Electrical'}">selected</c:if>>Electrical</option>
                    <option value="Wi-Fi" <c:if test="${category == 'Wi-Fi'}">selected</c:if>>Wi-Fi</option>
                    <option value="Cleaning" <c:if test="${category == 'Cleaning'}">selected</c:if>>Cleaning</option>
                    <option value="Furniture" <c:if test="${category == 'Furniture'}">selected</c:if>>Furniture</option>
                    <option value="Other" <c:if test="${category == 'Other'}">selected</c:if>>Other</option>
                </select>

                <button type="submit" class="btn btn-secondary">Filter</button>
                <a href="${pageContext.request.contextPath}/student/complaint?action=history" class="btn btn-secondary" style="padding: 10px 14px;">Reset</a>
            </form>

            <c:choose>
                <c:when test="${empty complaints}">
                    <div style="text-align: center; padding: 40px 0; color: var(--text-muted);">
                        <p style="font-size: 1.1rem; margin-bottom: 12px;">No complaints found matching your filter criteria.</p>
                    </div>
                </c:when>
                <c:otherwise>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Complaint ID</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Room</th>
                                    <th>Status</th>
                                    <th>Submitted Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach var="c" items="${complaints}">
                                    <tr>
                                        <td><strong><c:out value="${c.complaintId}"/></strong></td>
                                        <td><c:out value="${c.title}"/></td>
                                        <td><c:out value="${c.category}"/></td>
                                        <td>
                                            <span class="badge badge-priority badge-${c.priority.toLowerCase()}">
                                                <c:out value="${c.priority}"/>
                                            </span>
                                        </td>
                                        <td><c:out value="${c.roomNumber}"/></td>
                                        <td>
                                            <span class="badge badge-${c.status.toLowerCase()}">
                                                <c:out value="${c.status}"/>
                                            </span>
                                        </td>
                                        <td><fmt:formatDate value="${c.createdAt}" pattern="yyyy-MM-dd HH:mm"/></td>
                                        <td>
                                            <div style="display: flex; gap: 6px;">
                                                <a href="${pageContext.request.contextPath}/student/complaint?action=view&id=${c.complaintId}" class="btn btn-secondary btn-sm">View</a>

                                                <c:if test="${c.status == 'PENDING'}">
                                                    <a href="${pageContext.request.contextPath}/student/complaint?action=edit&id=${c.complaintId}" class="btn btn-secondary btn-sm" style="color: #60a5fa;">Edit</a>

                                                    <form action="${pageContext.request.contextPath}/student/complaint" method="post" style="display: inline;">
                                                        <input type="hidden" name="csrfToken" value="${csrfToken}"/>
                                                        <input type="hidden" name="action" value="cancel"/>
                                                        <input type="hidden" name="complaintId" value="${c.complaintId}"/>
                                                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to cancel complaint ${c.complaintId}?');">Cancel</button>
                                                    </form>
                                                </c:if>
                                            </div>
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
