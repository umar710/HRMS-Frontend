// frontend/src/components/TeamAssignment.js
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeAPI } from "../services/api";

function TeamAssignment({ employee, teams, onSuccess, onCancel }) {
  const [selectedTeams, setSelectedTeams] = useState(
    new Set(employee?.teams?.map((t) => t.id) || [])
  );
  const queryClient = useQueryClient();

  const assignmentMutation = useMutation({
    mutationFn: ({ employeeId, teamId }) =>
      employeeAPI.assignToTeam(employeeId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const removalMutation = useMutation({
    mutationFn: ({ employeeId, teamId }) =>
      employeeAPI.removeFromTeam(employeeId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const handleTeamToggle = async (teamId) => {
    const isCurrentlyAssigned = selectedTeams.has(teamId);

    try {
      if (isCurrentlyAssigned) {
        await removalMutation.mutateAsync({
          employeeId: employee.id,
          teamId: teamId,
        });
        setSelectedTeams((prev) => {
          const newSet = new Set(prev);
          newSet.delete(teamId);
          return newSet;
        });
      } else {
        await assignmentMutation.mutateAsync({
          employeeId: employee.id,
          teamId: teamId,
        });
        setSelectedTeams((prev) => new Set(prev).add(teamId));
      }
    } catch (error) {
      console.error("Team assignment error:", error);
    }
  };

  const currentTeams = employee?.teams || [];
  const availableTeams = teams.filter(
    (team) => !currentTeams.some((t) => t.id === team.id)
  );

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Current Teams
        </h4>
        {currentTeams.length === 0 ? (
          <p className="text-sm text-gray-500">Not assigned to any teams</p>
        ) : (
          <div className="space-y-2">
            {currentTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium">{team.name}</span>
                <button
                  onClick={() => handleTeamToggle(team.id)}
                  disabled={removalMutation.isLoading}
                  className="px-3 py-1 text-xs text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {removalMutation.isLoading ? "Removing..." : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Available Teams
        </h4>
        {availableTeams.length === 0 ? (
          <p className="text-sm text-gray-500">No available teams to assign</p>
        ) : (
          <div className="space-y-2">
            {availableTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium">{team.name}</span>
                <button
                  onClick={() => handleTeamToggle(team.id)}
                  disabled={assignmentMutation.isLoading}
                  className="px-3 py-1 text-xs text-green-600 bg-white border border-green-300 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {assignmentMutation.isLoading ? "Assigning..." : "Assign"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {(assignmentMutation.isError || removalMutation.isError) && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            {assignmentMutation.error?.response?.data?.error ||
              removalMutation.error?.response?.data?.error ||
              "An error occurred while updating team assignment"}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={onSuccess}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default TeamAssignment;
