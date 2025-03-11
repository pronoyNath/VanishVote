import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const VotingPage = () => {
  const { pollId } = useParams(); // Get poll ID from the URL
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [reactions, setReactions] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [isExpired, setIsExpired] = useState(false); // Track if the poll has expired

  // Fetch poll details
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/polls/${pollId}`);
        const pollData = response.data;

        // Ensure votes is a Map
        if (pollData.votes && typeof pollData.votes === "object" && !(pollData.votes instanceof Map)) {
          pollData.votes = new Map(Object.entries(pollData.votes));
        }

        // Check if the poll has expired
        const currentTime = new Date();
        const expiresAt = new Date(pollData.expiresAt);
        if (currentTime > expiresAt) {
          setIsExpired(true);
        }

        setPoll(pollData);
        setReactions(pollData.reactions || {});
      } catch (error) {
        console.error("Error fetching poll:", error);
      }
    };
    fetchPoll();
  }, [pollId]);

  // Handle voting
  const handleVote = async () => {
    try {
      await axios.post(`http://localhost:3000/api/polls/${pollId}/vote`, {
        option: selectedOption,
      });
      setHasVoted(true); // Mark that the user has voted
      alert("Vote submitted!");

      // Refresh poll data to show updated results
      const response = await axios.get(`http://localhost:3000/api/polls/${pollId}`);
      const pollData = response.data;

      // Ensure votes is a Map
      if (pollData.votes && typeof pollData.votes === "object" && !(pollData.votes instanceof Map)) {
        pollData.votes = new Map(Object.entries(pollData.votes));
      }

      setPoll(pollData);
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  // Handle reactions
  const handleReaction = async (reaction) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/polls/${pollId}/react`, {
        reaction,
      });
      setReactions(response.data.reactions);
    } catch (error) {
      console.error("Error submitting reaction:", error);
    }
  };

  if (!poll) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{poll.question}</h1>

      {/* Show "Vote Expired" message if the poll has expired */}
      {isExpired && (
        <div className="text-center text-red-500 font-semibold mb-4">
          This poll has expired. Voting is no longer allowed.
        </div>
      )}

      {/* Poll Options */}
      {poll.options.map((option, index) => (
        <div key={index} className="mb-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value={option}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="mr-2"
              disabled={hasVoted || isExpired} // Disable options after voting or if expired
            />
            {option}
          </label>
          {/* Show vote count if the user has voted or the poll has expired */}
          {(hasVoted || isExpired) && (
            <span className="ml-4 text-gray-600">
              Votes: {poll.votes.get(option) || 0}
            </span>
          )}
        </div>
      ))}

      {/* Vote Button */}
      {!isExpired && (
        <button
          onClick={handleVote}
          disabled={!selectedOption || hasVoted} // Disable if no option is selected or user has voted
          className={`w-full p-2 ${
            !selectedOption || hasVoted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white rounded mb-4`}
        >
          {hasVoted ? "Vote Submitted" : "Vote"}
        </button>
      )}

      {/* Reactions Section */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Reactions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => handleReaction("🔥")}
            className="flex items-center space-x-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            <span>🔥</span>
            <span>{reactions["🔥"] || 0}</span>
          </button>
          <button
            onClick={() => handleReaction("👍")}
            className="flex items-center space-x-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            <span>👍</span>
            <span>{reactions["👍"] || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;