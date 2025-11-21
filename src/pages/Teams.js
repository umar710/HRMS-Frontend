// frontend/src/pages/Teams.js
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamAPI } from "../services/api";
import TeamForm from "../components/TeamForm";
import Modal from "../components/Modal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

function Teams() {
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: teamsData,
    isLoading: teamsLoading,
    error: teamsError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: teamAPI.getAll,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: teamAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  // Safely get teams array
  const teams = Array.isArray(teamsData) ? teamsData : [];

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowTeamForm(true);
  };

  const handleDelete = async (team) => {
    if (
      window.confirm(`Are you sure you want to delete the team "${team.name}"?`)
    ) {
      await deleteMutation.mutateAsync(team.id);
    }
  };

  const handleFormClose = () => {
    setShowTeamForm(false);
    setEditingTeam(null);
  };

  if (teamsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (teamsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">
          Error loading teams: {teamsError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organization's teams and their members.
          </p>
        </div>
        <button
          onClick={() => setShowTeamForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {team.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(team)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(team)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {team.description && (
                <p className="mt-2 text-sm text-gray-500">{team.description}</p>
              )}

              <div className="mt-4 flex items-center text-sm text-gray-500">
                <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {team.member_count || 0} members
              </div>

              {team.members && team.members.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Team Members:
                  </h4>
                  <ul className="space-y-1">
                    {team.members.slice(0, 3).map((member) => (
                      <li key={member.id} className="text-sm text-gray-600">
                        {member.first_name} {member.last_name}
                      </li>
                    ))}
                    {team.members.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{team.members.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No teams</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first team.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowTeamForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Team
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showTeamForm}
        onClose={handleFormClose}
        title={editingTeam ? "Edit Team" : "Create Team"}
      >
        <TeamForm
          team={editingTeam}
          onSuccess={() => {
            handleFormClose();
            queryClient.invalidateQueries({ queryKey: ["teams"] });
          }}
          onCancel={handleFormClose}
        />
      </Modal>
    </div>
  );
}

export default Teams;
