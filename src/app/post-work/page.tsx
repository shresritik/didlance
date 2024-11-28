"use client";
import React, { useState } from "react";
import { DollarSign, AlertCircle } from "lucide-react";
import CreateJobPostingStep2 from "@/components/Skills/index";
import { JobDetails, JobStatus } from "@/types/job-details";
import { useToast } from "@/hooks/use-toast";

import { useWallet } from "@suiet/wallet-kit";
interface Skill {
  id: string;
  name: string;
}

const CreateJobPosting = () => {
  const wallet = useWallet();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Adobe Premiere Pro",
    "Video Editing",
    "Node js",
    "React js",
    "MongoDB",
    "API",
  ]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budgetType: "Fixed Price",
    amount: "",
    duration: "Less than 1 month",
    experienceLevel: "Entry Level",
    attachments: [],
    additionalQuestions: [{ question: "", required: false }],
  });

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionChange = (index: any, field: any, value: any) => {
    const updatedQuestions = formData.additionalQuestions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setFormData((prev) => ({
      ...prev,
      additionalQuestions: updatedQuestions,
    }));
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      additionalQuestions: [
        ...prev.additionalQuestions,
        { question: "", required: false },
      ],
    }));
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Generate a unique ID for the job
      const jobId = `job-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Get the current timestamp
      const currentTime = new Date().toISOString();

      const walletAddress = wallet.account?.address;
      if (!walletAddress) return;
      // Transform the form data into the JobDetails format
      const jobData: JobDetails = {
        id: jobId,
        sui_address: walletAddress.toLowerCase(),
        title: formData.title,
        description: formData.description,
        long_description: formData.description, // You might want to add a separate field for this
        budget: `${formData.budgetType} - ${formData.amount}`,
        time_posted: currentTime,
        category: "Design & Creative", // You might want to make this dynamic
        expertise: formData.experienceLevel,
        proposals: [], // Initialize with 0 proposals
        client_rating: 0, // You might want to get this from the user's profile
        client_location: "Remote", // You might want to get this from the user's profile
        job_type: formData.budgetType,
        project_length: formData.duration,
        weekly_hours:
          formData.budgetType === "Hourly" ? "To be discussed" : "40 hours",
        skills: selectedSkills,
        activity_on: currentTime,
        job_status: JobStatus.OPEN,
        client_history: {
          jobsPosted: 1, // You might want to get this from the user's profile
          hireRate: 0, // You might want to get this from the user's profile
          totalSpent: "$0", // You might want to get this from the user's profile
          memberSince: currentTime, // You might want to get this from the user's profile
          verificationStatus: {
            payment: true,
            phone: true,
            email: true,
          },
        },
        attachments: formData.attachments.map((attachment) =>
          attachment.toString()
        ),
        questions: formData.additionalQuestions
          .filter((q) => q.question.trim() !== "")
          .map((q) => q.question),
        userId: localStorage.getItem("userId") || "0",
      };

      // Submit the job data to the API
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create job posting");
      }

      const createdJob = await response.json();
      toast({
        variant: "destructive",
        title: "Posted Successfully",
        description: "View in your Jobs section.",
        className: "bg-green-500 text-white",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Handle successful submission
      // You might want to redirect to the job detail page or show a success message
      window.location.href = `/jobs/${createdJob.id}`;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      console.error("Error creating job posting:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post a Project</h1>

      <form className="space-y-8">
        {/* Step 1: Project Overview */}
        {currentStep === 1 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Step 1: Project Overview</h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Build a Modern E-commerce Website"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Project Description
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your project in detail..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Include specific requirements, deliverables, and any relevant
                background information.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Required Skills */}
        {currentStep === 2 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Step 2: Required Skills</h2>
            <CreateJobPostingStep2
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              setSelectedSkills={setSelectedSkills}
              selectedSkills={selectedSkills}
            />
          </section>
        )}

        {/* Step 3: Budget */}
        {currentStep === 3 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Step 3: Budget</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget Type
                </label>
                <select
                  value={formData.budgetType}
                  onChange={(e) =>
                    handleInputChange("budgetType", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Fixed Price</option>
                  <option>Hourly Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </section>
        )}

        {/* Step 4: Timeline */}
        {currentStep === 4 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Step 4: Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Less than 1 month</option>
                  <option>1-3 months</option>
                  <option>3-6 months</option>
                  <option>More than 6 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    handleInputChange("experienceLevel", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Entry Level</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </section>
        )}

        {/* Step 5: Additional Details */}
        {currentStep === 5 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Step 5: Additional Details
            </h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const filesArray = Array.from(files);
                      handleInputChange("attachments", filesArray);
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700"
                >
                  Click to upload
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  or drag and drop files here (max 10MB per file)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Questions
              </label>
              {formData.additionalQuestions.map((q, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mr-2"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "required",
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Required</span>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="text-blue-600 hover:text-blue-700"
              >
                + Add Additional Question
              </button>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? "Posting Job..." : "Post Job"}
              </button>
            </div>
          </section>
        )}

        {/* Preview Section */}
        {currentStep === 6 && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="h-5 w-5" />
              <span>Preview your posting before submitting</span>
            </div>
            <button
              type="button"
              className="px-4 py-2 text-blue-600 hover:text-blue-700"
            >
              Preview
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateJobPosting;
