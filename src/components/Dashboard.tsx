import React from "react";
import { Users, FileText, Calendar, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { format, isToday, isYesterday, startOfWeek, endOfWeek } from "date-fns";

export default function Dashboard() {
  const { state } = useApp();
  const { members, remarks } = state;

  // Calculate stats
  const todayRemarks = remarks.filter((r) => isToday(r.date));
  const yesterdayRemarks = remarks?.filter((r) => isYesterday(r?.date));
  const thisWeekRemarks = remarks.filter((r) => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    return r.date >= start && r.date <= end;
  });

  const recentRemarks = remarks
    ?.slice() // avoid mutating original array
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    ?.slice(0, 5);
  console.log("///", recentRemarks);

  const memberActivity = members.map((member) => ({
    ...member,
    remarkCount: remarks.filter((r: any) => r.memberId?._id === member.id)
      .length,
    lastRemark: remarks
      .filter((r) => r.memberId === member.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0],
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your team's daily progress and remarks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Remarks</p>
              <p className="text-2xl font-bold text-gray-900">
                {remarks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Today's Remarks
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {todayRemarks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {thisWeekRemarks.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Remarks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Remarks
            </h2>
          </div>
          <div className="p-6">
            {recentRemarks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No remarks yet</p>
            ) : (
              <div className="space-y-4">
                {recentRemarks.map((remark) => (
                  <div key={remark.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {remark.memberName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {remark.memberName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {remark.remark}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(remark.date, "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Team Activity
            </h2>
          </div>
          <div className="p-6">
            {memberActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No team members yet
              </p>
            ) : (
              <div className="space-y-4">
                {memberActivity.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {member.remarkCount} remarks
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.lastRemark
                          ? format(member.lastRemark.date, "MMM d")
                          : "No remarks"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
