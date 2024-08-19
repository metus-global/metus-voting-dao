import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CreatePoll from "./pages/CreatePoll";
import MyPolls from "./pages/MyPolls";
import ViewPoll from "./pages/ViewPoll";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "my-polls",
        element: <MyPolls />,
      },
      {
        path: "create-poll",
        element: <CreatePoll />,
      },
      {
        path: "poll/:id",
        element: <ViewPoll />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
