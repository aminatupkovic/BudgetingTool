import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Main, { mainLoader } from "./layouts/Main";
import axios from 'axios';
// Actions
import { logoutAction } from "./actions/logout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Routes
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
        action: dashboardAction,
        errorElement: <Error />
      },
      {
        path: "logout",
        action: logoutAction
      }
    ]
  },
]);

function App() {
  const [backendMessage, setBackendMessage] = useState("");

  // Fetch initial API data
  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      setBackendMessage(response.data); // Example: Show the "Hello" message from backend
    } catch (error) {
      console.error("Error fetching backend data:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
      {/* Example: Display backend message */}
      {backendMessage && <p>Backend says: {backendMessage}</p>}
    </div>
  );
}

export default App;
