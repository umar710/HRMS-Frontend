// frontend/src/pages/AuditLogs.js
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { auditAPI } from "../services/api";
import { format } from "date-fns";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

function AuditLogs() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    action: "",
    resource_type: "",
    start_date: "",
    end_date: "",
  });

  const { data: auditData, isLoading } = useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => auditAPI.getLogs(filters),
    keepPreviousData: true,
  });

  const { data: stats } = useQuery({
    queryKey: ["audit-stats"],
    queryFn: auditAPI.getStats,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: "bg-green-100 text-green-800",
      UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800",
      LOGIN: "bg-purple-100 text-purple-800",
      LOGOUT: "bg-gray-100 text-gray-800",
      ASSIGN: "bg-yellow-100 text-yellow-800",
      UNASSIGN: "bg-orange-100 text-orange-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-2 text-sm text-gray-700">
          Monitor all activities and changes in your organisation.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.action_stats?.slice(0, 4).map((stat) => (
            <div key={stat.action} className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">
                {stat.action}
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stat.count}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="ASSIGN">Assign</option>
              <option value="UNASSIGN">Unassign</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resource Type
            </label>
            <select
              value={filters.resource_type}
              onChange={(e) =>
                handleFilterChange("resource_type", e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Resources</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="TEAM">Team</option>
              <option value="USER">User</option>
              <option value="EMPLOYEE_TEAM">Employee-Team</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditData?.logs?.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(log.created_at), "MMM dd, yyyy HH:mm:ss")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.user_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.user_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.resource_type}
                    {log.resource_id && (
                      <div className="text-xs text-gray-400">
                        ID: {log.resource_id}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details && log.details !== "{}" ? (
                      <pre className="text-xs bg-gray-50 p-2 rounded">
                        {JSON.stringify(JSON.parse(log.details), null, 2)}
                      </pre>
                    ) : (
                      <span className="text-gray-400">No details</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {auditData?.pagination && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(auditData.pagination.page - 1) *
                      auditData.pagination.limit +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      auditData.pagination.page * auditData.pagination.limit,
                      auditData.pagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {auditData.pagination.total}
                  </span>{" "}
                  results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handlePageChange(auditData.pagination.page - 1)
                  }
                  disabled={auditData.pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    handlePageChange(auditData.pagination.page + 1)
                  }
                  disabled={
                    auditData.pagination.page >= auditData.pagination.pages
                  }
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {(!auditData?.logs || auditData.logs.length === 0) && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No audit logs
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No activities found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;
