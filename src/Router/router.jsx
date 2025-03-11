import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import VotingPage from "../components/VotePoll";

const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children: []
    },
    {  path: "/poll/:pollId",
      element: <VotingPage/>,
      children: []
    },
])

export default router;