import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Member } from "../types";
import axiosInstance from "../axiosInstance";

export default function AddMember() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
  });
  const [errors, setErrors] = useState<{ name?: string; role?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; role?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
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

    const newMember: Member = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      role: formData.role.trim(),
      createdAt: new Date(),
    };

    dispatch({ type: "ADD_MEMBER", payload: newMember });
    await handleCreate(newMember);
    // Reset form
    setFormData({ name: "", role: "" });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleCreate = async (data: any) => {
    try {
      const resp = await axiosInstance.post(`/members`, data);
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

  return (
    <div className="max-w-2xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Team Member</h1>
        <p className="mt-2 text-gray-600">
          Add a new member to your team to start tracking their daily progress
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter team member's full name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <X className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Role/Position *
            </label>
            <input
              type="text"
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.role
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="e.g., Frontend Developer, Designer, Project Manager"
            />
            {errors.role && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <X className="w-4 h-4 mr-1" />
                {errors.role}
              </p>
            )}
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
                  Adding Member...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add Team Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
