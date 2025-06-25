import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Remark } from "../types";
import axiosInstance from "../axiosInstance";

export default function AddRemark() {
  const { state, dispatch } = useApp();
  const { members } = state;
  console.log(members);
  

  const [formData, setFormData] = useState({
    memberId: "",
    remark: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<{ memberId?: string; remark?: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { memberId?: string; remark?: string } = {};

    if (!formData.memberId) {
      newErrors.memberId = "Please select a team member";
    }

    if (!formData.remark.trim()) {
      newErrors.remark = "Remark is required";
    } else if (formData.remark.length < 5) {
      newErrors.remark = "Remark must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const selectedMember = members.find((m) => m.id === formData.memberId);

    const newRemark: Remark = {
      id: Date.now().toString(),
      memberId: formData.memberId,
      memberName: selectedMember?.name || "",
      remark: formData.remark.trim(),
      date: new Date(formData.date),
      createdAt: new Date(),
    };

    dispatch({ type: "ADD_REMARK", payload: newRemark });
    await handleCreate(newRemark);

    // Reset form (keep member and date for convenience)
    setFormData((prev) => ({ ...prev, remark: "" }));
    setErrors({});
    setIsSubmitting(false);
  };
  const handleCreate = async (data: any) => {
    try {
      const resp = await axiosInstance.post(`/remarks`, data);
      if (resp.status === 201) {
        console.log("Created Suceesssfully");
      }
    } catch (error: any) {
      console.error(error);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (members.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No Team Members
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                You need to add team members before you can create remarks.
                Please add team members first.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Daily Remark</h1>
        <p className="mt-2 text-gray-600">
          Record daily observations and feedback for your team members
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Selection */}
          <div>
            <label
              htmlFor="memberId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Team Member *
            </label>
            <select
              id="memberId"
              // value={formData.memberId}
              onChange={(e) => {
                handleInputChange("memberId", e?.target?.value)
                
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.memberId
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select a team member</option>
              {members.map((member:any) => (
                <option key={member?._id} value={member?._id}>
                  {member.name} - {member.role}
                </option>
              ))}
            </select>
            {errors.memberId && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <X className="w-4 h-4 mr-1" />
                {errors.memberId}
              </p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Remark Field */}
          <div>
            <label
              htmlFor="remark"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Daily Remark *
            </label>
            <textarea
              id="remark"
              value={formData.remark}
              onChange={(e) => handleInputChange("remark", e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                errors.remark
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Describe the team member's work, achievements, challenges, or feedback for today..."
            />
            {errors.remark && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <X className="w-4 h-4 mr-1" />
                {errors.remark}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Minimum 5 characters. Be specific about accomplishments,
              challenges, or feedback.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding Remark...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Remark
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
