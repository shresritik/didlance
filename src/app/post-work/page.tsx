"use client"
import React, { useState } from 'react';
import { DollarSign, AlertCircle } from 'lucide-react';
import CreateJobPostingStep2 from '@/components/Skills/index';

interface Skill {
  id: string;
  name: string;
}

const CreateJobPosting = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [additionalQuestions, setAdditionalQuestions] = useState<
    { question: string; required: boolean }[]
  >([]);

  const sampleSkills: Skill[] = [
    { id: '1', name: 'React' },
    { id: '2', name: 'Node.js' },
    { id: '3', name: 'TypeScript' },
    { id: '4', name: 'Python' },
    { id: '5', name: 'Java' },
    { id: '6', name: 'UI/UX Design' },
  ];

  const handleSkillToggle = (skillName: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillName)
        ? prev.filter(skill => skill !== skillName)
        : [...prev, skillName]
    );
  };

  const handleAddQuestion = () => {
    setAdditionalQuestions([...additionalQuestions, { question: '', required: false }]);
  };

  const handleQuestionChange = (index: number, field: 'question' | 'required', value: string | boolean) => {
    setAdditionalQuestions(prev =>
      prev.map((q, i) =>
        i === index
          ? { ...q, [field]: value }
          : q
      )
    );
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
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
                placeholder="Describe your project in detail..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Include specific requirements, deliverables, and any relevant background information.
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
            <CreateJobPostingStep2 handlePrevious={handlePrevious} handleNext={handleNext} />
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
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Fixed Price</option>
                  <option>Hourly Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Enter amount"
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
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
            <h2 className="text-xl font-semibold">Step 5: Additional Details</h2>
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
              {additionalQuestions.map((q, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mr-2"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => handleQuestionChange(index, 'required', e.target.checked)}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post Project
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
