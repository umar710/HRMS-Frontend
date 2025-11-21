// frontend/src/pages/Employees.js
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeAPI, teamAPI } from "../services/api";
import EmployeeForm from "../components/EmployeeForm";
import TeamAssignment from "../components/TeamAssignment";
import Modal from "../components/Modal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

function Employees() {
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showTeamAssignment, setShowTeamAssignment] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: employeesData,
    isLoading: employeesLoading,
    error: employeesError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeAPI.getAll,
    staleTime: 5 * 60 * 1000,
  });

  const { data: teamsData } = useQuery({
    queryKey: ["teams"],
    queryFn: teamAPI.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: employeeAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  // Safely get employees array
  const employees = Array.isArray(employeesData) ? employeesData : [];
  const teams = Array.isArray(teamsData) ? teamsData : [];

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleAssignTeams = (employee) => {
    setSelectedEmployee(employee);
    setShowTeamAssignment(true);
  };

  const handleDelete = async (employee) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`
      )
    ) {
      await deleteMutation.mutateAsync(employee.id);
    }
  };

  const handleFormClose = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

  if (employeesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (employeesError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">
          Error loading employees: {employeesError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organization's employees and their team assignments.
          </p>
        </div>
        <button
          onClick={() => setShowEmployeeForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {employees.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No employees
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first employee.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <li key={employee.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-lg">
                            {employee.first_name?.[0]}
                            {employee.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.position}{" "}
                          {employee.department && `• ${employee.department}`}
                        </div>
                        {employee.teams && employee.teams.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {employee.teams.map((team) => (
                              <span
                                key={team.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                              >
                                {team.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAssignTeams(employee)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Assign Teams"
                      >
                        <UserGroupIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={showEmployeeForm}
        onClose={handleFormClose}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
      >
        <EmployeeForm
          employee={editingEmployee}
          onSuccess={() => {
            handleFormClose();
            queryClient.invalidateQueries({ queryKey: ["employees"] });
          }}
          onCancel={handleFormClose}
        />
      </Modal>

      <Modal
        isOpen={showTeamAssignment}
        onClose={() => setShowTeamAssignment(false)}
        title={`Assign Teams - ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}`}
      >
        <TeamAssignment
          employee={selectedEmployee}
          teams={teams}
          onSuccess={() => {
            setShowTeamAssignment(false);
            queryClient.invalidateQueries({ queryKey: ["employees"] });
          }}
          onCancel={() => setShowTeamAssignment(false)}
        />
      </Modal>
    </div>
  );
}

export default Employees;
