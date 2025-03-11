import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const VotingPage = () => {
  const { pollId } = useParams(); // Get poll ID from the URL
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [reactions, setReactions] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Fetch poll details
  const fetchPoll = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/polls/${pollId}`);
      const pollData = response.data;

      // Ensure votes is a Map
      if (pollData.votes && typeof pollData.votes === "object" && !(pollData.votes instanceof Map)) {
        pollData.votes = new Map(Object.entries(pollData.votes));
      }

      setPoll(pollData);
      setReactions(pollData.reactions || {});

      // Check if the poll has expired
      const currentTime = new Date();
      const expiresAt = new Date(pollData.expiresAt);
      if (currentTime > expiresAt) {
        setIsExpired(true);
      }
    } catch (error) {
      console.error("Error fetching poll:", error);
    }
  };

  useEffect(() => {
    fetchPoll();

    // Poll expiration check interval (every 5 seconds)
    const interval = setInterval(() => {
      if (poll && !isExpired) {
        const currentTime = new Date();
        const expiresAt = new Date(poll.expiresAt);
        if (currentTime > expiresAt) {
          setIsExpired(true);
        }
      }
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [pollId, poll, isExpired]);

  // Handle voting
  const handleVote = async () => {
    try {
      await axios.post(`http://localhost:3000/api/polls/${pollId}/vote`, {
        option: selectedOption,
      });
      setHasVoted(true); // Mark that the user has voted
      alert("Vote submitted!");

      // Refresh poll data to show updated results
      fetchPoll();
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
    <div className="bg-fuchsia-50 h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg min-w-[300px] md:min-w-[500px]">
      <h1 className="text-2xl text-center font-bold mb-4  capitalize">{poll.question}</h1>
<hr className="mb-2 -mt-1"/>
      {/* Show "Vote Expired" message if the poll has expired */}
      {isExpired && (
        <div className="text-center text-red-500 font-semibold mb-4 border border-red-500 p-2">
          This poll has expired. Voting is no longer allowed.
        </div>
      )}

      {/* Poll Options */}
      {poll.options.map((option, index) => (
        <div key={index} className="mb-2 w-full flex items-center justify-between">
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
          {(hasVoted || isExpired || poll.showResults === "show") && (
            <span className="ml-4 text-gray-600">
              Votes: {poll.votes.get(option) || 0}
            </span>
          )}
        </div>
      ))}
{console.log(isExpired , poll.showResults,poll)}
      {/* Show message based on result visibility */}
      {!isExpired && poll.showResults === "hide" && (
        <div className="font-semibold p-2 mt-5 bg-fuchsia-100 rounded-lg capitalize text-center text-gray-600 mb-4">
          Results will be shown after the poll ends.
        </div>
      )}

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
    </div>
  );
};

export default VotingPage;
