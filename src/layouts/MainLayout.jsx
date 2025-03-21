import React from "react";
import CreatePoll from "../components/CreatePoll";
import VotePoll from "../components/VotePoll";


const MainLayout = () => {
  // Replace this with your routing logic
  const isCreatePollPage = true; // Example condition
  const pollId = "123"; // Example poll ID

  return (
    <div className="min-h-screen flex items-center justify-center bg-fuchsia-50 p-4">
      {isCreatePollPage ? <CreatePoll /> : <VotePoll pollId={pollId} />}
    </div>
  );
};

export default MainLayout;