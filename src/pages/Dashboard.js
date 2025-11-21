// frontend/src/pages/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employeeAPI, teamAPI, auditAPI } from "../services/api";
import {
  UsersIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

function Dashboard() {
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeAPI.getAll,
  });

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: teamAPI.getAll,
  });

  const { data: auditStats } = useQuery({
    queryKey: ["audit-stats"],
    queryFn: auditAPI.getStats,
  });

  const stats = [
    {
      name: "Total Employees",
      value: employees?.length || 0,
      icon: UsersIcon,
      color: "bg-blue-500",
      href: "/employees",
    },
    {
      name: "Total Teams",
      value: teams?.length || 0,
      icon: UserGroupIcon,
      color: "bg-green-500",
      href: "/teams",
    },
    {
      name: "Recent Activities",
      value: auditStats?.daily_activity?.[0]?.count || 0,
      icon: DocumentTextIcon,
      color: "bg-purple-500",
      href: "/audit-logs",
    },
    {
      name: "Total Actions",
      value:
        auditStats?.action_stats?.reduce((acc, stat) => acc + stat.count, 0) ||
        0,
      icon: ChartBarIcon,
      color: "bg-orange-500",
      href: "/audit-logs",
    },
  ];

  const recentActivities = auditStats?.daily_activity?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome to your HR Management System dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon
                    className={`h-8 w-8 ${item.color} text-white rounded-lg p-1.5`}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">
                        {item.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Employees */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Employees
            </h3>
            {employees && employees.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {employees.slice(0, 5).map((employee) => (
                  <li key={employee.id} className="py-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {employee.first_name[0]}
                            {employee.last_name[0]}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No employees yet</p>
            )}
            <div className="mt-4">
              <Link
                to="/employees"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all employees
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            {recentActivities.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="py-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.count} actions
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
            <div className="mt-4">
              <Link
                to="/audit-logs"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all activities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
