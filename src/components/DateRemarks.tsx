import React, { useState } from "react";
import { Calendar, MessageSquare, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { format, parseISO } from "date-fns";

export default function DateRemarks() {
  const { state } = useApp();
  const { remarks } = state;
  const [selectedDate, setSelectedDate] = useState("");

  const filteredRemarks = selectedDate
    ? remarks.filter((r) => format(r.date, "yyyy-MM-dd") === selectedDate)
    : [];

  // Sort remarks by creation time (newest first)
  const sortedRemarks = filteredRemarks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Remarks by Date</h1>
        <p className="mt-2 text-gray-600">
          View all remarks for a specific date
        </p>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label
          htmlFor="date-select"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Select Date
        </label>
        <input
          type="date"
          id="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-auto min-w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Results */}
      {selectedDate ? (
        <div className="space-y-6">
          {/* Date Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}
                  </h2>
                  <p className="text-gray-600">Daily team remarks</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  {filteredRemarks.length}
                </p>
                <p className="text-sm text-gray-500">Remarks</p>
              </div>
            </div>
          </div>

          {/* Remarks List */}
          {sortedRemarks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No remarks found
              </h3>
              <p className="text-gray-600">
                No remarks were added for this date.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedRemarks.map((remark) => (
                <div
                  key={remark.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {remark.memberName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {remark.memberName}
                        </h3>
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {remark.remark}
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Added on {format(remark.createdAt, "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a date
          </h3>
          <p className="text-gray-600">
            Choose a date from the date picker above to view remarks for that
            day.
          </p>
        </div>
      )}
    </div>
  );
}
