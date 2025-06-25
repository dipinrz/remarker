import React, { useState } from "react";
import { Users, Calendar, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";
import { format } from "date-fns";

export default function MemberRemarks() {
  const { state } = useApp();
  const { members, remarks } = state;
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const filteredRemarks = selectedMemberId
    ? remarks.filter((r: any) => r.memberId?._id === selectedMemberId)
    : [];

  console.log(
    filteredRemarks,
    remarks.filter((r: any) => r.memberId?._id === selectedMemberId)
  );

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  // Sort remarks by date (newest first)
  const sortedRemarks = filteredRemarks.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Remarks by Member</h1>
        <p className="mt-2 text-gray-600">
          View all remarks for a specific team member
        </p>
      </div>

      {/* Member Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label
          htmlFor="member-select"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Select Team Member
        </label>
        <select
          id="member-select"
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value)}
          className="w-full sm:w-auto min-w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Choose a team member</option>
          {members.map((member: any) => (
            <option key={member._id} value={member._id}>
              {member.name} - {member.role}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {selectedMemberId ? (
        <div className="space-y-6">
          {/* Member Info Card */}
          {selectedMember && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {selectedMember.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedMember.name}
                  </h2>
                  <p className="text-gray-600">{selectedMember.role}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredRemarks.length}
                  </p>
                  <p className="text-sm text-gray-500">Total Remarks</p>
                </div>
              </div>
            </div>
          )}

          {/* Remarks List */}
          {sortedRemarks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No remarks found
              </h3>
              <p className="text-gray-600">
                No remarks have been added for this team member yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedRemarks.map((remark) => (
                <div
                  key={remark.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {format(remark.date, "EEEE, MMMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {remark.remark}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Added on{" "}
                      {format(remark.createdAt, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a team member
          </h3>
          <p className="text-gray-600">
            Choose a team member from the dropdown above to view their remarks.
          </p>
        </div>
      )}
    </div>
  );
}
