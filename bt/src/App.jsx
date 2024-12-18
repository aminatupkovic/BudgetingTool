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
    const userId = localStorage.getItem("userId"); // Assuming you're storing userId in localStorage
  if (!userId) {
    console.error("No user ID found in localStorage.");
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/budgets/${userId}`);
    setBackendMessage(`You have ${response.data.length} budgets.`); // Adjust as needed
  } catch (error) {
    console.error("Error fetching backend data:", error);
  }
  }
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
      
    </div>
  );
}

export default App;
