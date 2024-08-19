import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import useWeb3Function from "./hooks/useWeb3Functions";

function App() {
  const { fetchInit } = useWeb3Function();
  useEffect(() => {
    fetchInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default App;
