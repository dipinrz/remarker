import React, { useState } from "react";
import { FileText, Search, Calendar, Users, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { format } from "date-fns";

export default function AllRemarks() {
  const { state, dispatch } = useApp();
  const { remarks, members } = state;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMember, setFilterMember] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "member" | "created">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter remarks based on search and member filter
  let filteredRemarks = remarks.filter((remark: any) => {
    const matchesSearch =
      remark.remark.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remark.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMember =
      !filterMember || remark.memberId?._id === filterMember;
    return matchesSearch && matchesMember;
  });

  // Sort remarks
 filteredRemarks = filteredRemarks.sort((a, b) => {
  let comparison = 0;

  switch (sortBy) {
    case "date":
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      break;
    case "member":
      comparison = a.memberName.localeCompare(b.memberName);
      break;
    case "created":
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      break;
  }

  return sortOrder === "desc" ? -comparison : comparison;
});

  const handleDeleteRemark = (remarkId: string) => {
    if (window.confirm("Are you sure you want to delete this remark?")) {
      dispatch({ type: "DELETE_REMARK", payload: remarkId });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Remarks</h1>
        <p className="mt-2 text-gray-600">
          View, search, and manage all team remarks
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Member Filter */}
          <select
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All members</option>
            {members.map((member: any) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "member" | "created")
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="date">Sort by Date</option>
            <option value="member">Sort by Member</option>
            <option value="created">Sort by Created</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredRemarks.length} Remarks Found
              </h2>
              <p className="text-gray-600">
                {searchTerm || filterMember
                  ? "Filtered results"
                  : "All team remarks"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Remarks List */}
      {filteredRemarks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No remarks found
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterMember
              ? "Try adjusting your search or filters."
              : "No remarks have been added yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRemarks.map((remark) => (
            <div
              key={remark.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {remark.memberName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {remark.memberName}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{format(remark.date, "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {remark.remark}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Added on{" "}
                        {format(remark.createdAt, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteRemark(remark.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete remark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
