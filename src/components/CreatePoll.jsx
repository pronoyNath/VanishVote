import React, { useState } from "react";
import axios from "axios";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [pollType, setPollType] = useState("multiple-choice"); // "multiple-choice" or "yes-no"
  const [options, setOptions] = useState(["", ""]); // For multiple-choice polls
  const [expiresIn, setExpiresIn] = useState(1);
  const [pollLink, setPollLink] = useState("");
  const [showResults, setShowResults] = useState("hide"); // "hide" or "show"

  // Handle poll type change
  const handlePollTypeChange = (type) => {
    setPollType(type);
    if (type === "yes-no") {
      setOptions(["Yes", "No"]); // Pre-fill options for yes/no polls
    } else {
      setOptions(["", ""]); // Reset options for multiple-choice polls
    }
  };

  // Handle creating a poll
  const handleCreatePoll = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/polls", {
        question,
        options,
        expiresIn,
        showResults, // Pass the result visibility option
      });
      setPollLink(`http://localhost:5173/poll/${response.data.id}`); // Use port 5173
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create Poll</h1>

      {/* Poll Question Input */}
      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {/* Poll Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Poll Type</label>
        <div className="flex space-x-4">
          <button
            onClick={() => handlePollTypeChange("multiple-choice")}
            className={`flex-1 p-2 rounded ${
              pollType === "multiple-choice"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Multiple Choice
          </button>
          <button
            onClick={() => handlePollTypeChange("yes-no")}
            className={`flex-1 p-2 rounded ${
              pollType === "yes-no"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Yes/No
          </button>
        </div>
      </div>

      {/* Poll Options */}
      {pollType === "multiple-choice" ? (
        <>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
          ))}
          <button
            onClick={() => setOptions([...options, ""])}
            className="w-full p-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Option
          </button>
        </>
      ) : (
        <div className="mb-4">
          <input
            type="text"
            value="Yes"
            readOnly
            className="w-full p-2 mb-2 border border-gray-300 rounded bg-gray-100"
          />
          <input
            type="text"
            value="No"
            readOnly
            className="w-full p-2 mb-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>
      )}

      {/* Result Visibility Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Result Visibility</label>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowResults("hide")}
            className={`flex-1 p-2 rounded ${
              showResults === "hide"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Hide Results Until End
          </button>
          <button
            onClick={() => setShowResults("show")}
            className={`flex-1 p-2 rounded ${
              showResults === "show"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Show Results During Voting
          </button>
        </div>
      </div>

      {/* Expiration Time Selector */}
      <select
        value={expiresIn}
        onChange={(e) => setExpiresIn(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      >
        <option value={1}>1 Hour</option>
        <option value={12}>12 Hours</option>
        <option value={24}>24 Hours</option>
      </select>

      {/* Create Poll Button */}
      <button
        onClick={handleCreatePoll}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create Poll
      </button>

      {/* Poll Link */}
      {pollLink && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm">Share this link:</p>
          <a href={pollLink} className="text-blue-500 underline">
            {pollLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;