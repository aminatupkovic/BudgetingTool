import { useLoaderData } from "react-router-dom";
import "../index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Intro from "../components/Intro";
import { toast } from "react-toastify";
import AddBudgetForm from "../components/AddBudgetForm";
import { createBudget } from "../helpers";

// Loader
export async function dashboardLoader() {
  const userId = localStorage.getItem("userId");
  if (!userId) return { userName: null, budgets: [] }; // No user logged in
  
  try {
    const { data: budgets } = await axios.get(`http://localhost:8080/api/budgets/${userId}`);
    return { userName: "Your Name", budgets }; // Replace "Your Name" with actual user data if required
  } catch (error) {
    console.error(error);
    throw new Error("Failed to load budgets.");
  }
}

// Action
export async function dashboardAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "newUser") {
    try {
      const response = await axios.post("http://localhost:8080/api/create-user", {
        userName: values.userName,
      });
      if (response.status === 200) {
        toast.success("Welcome!");
        localStorage.setItem("userId", response.data.userId);
      }
    } catch (error) {
      console.error(error);
      throw new Error("There was a problem creating your account.");
    }
  }

  if (_action === "createBudget") {
    const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("User not logged in!");
    try {
      const response = await axios.post("http://localhost:8080/api/create-budget", {
        name: values.newBudget,
        amount: values.newBudgetAmount,
        userId: userId,
      });
      if (response.status === 200) {
        toast.success("Budget created successfully");
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new Error("There was a problem creating your budget");
    }
  }
}

const Dashboard = () => {
  const { userName, budgets: initialBudgets } = useLoaderData();
  const [budgets, setBudgets] = useState(initialBudgets || []);
  const [loading, setLoading] = useState(false);

  // Fetch user budgets from the backend
  const fetchBudgets = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/api/budgets/${userId}`);
      setBudgets(data || []);
    } catch (error) {
      toast.error("Failed to fetch budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await fetchData("/budgets"); // Adjust the endpoint as necessary
        setBudgets(data);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      }
    };
    fetchBudgets();
  }, []);

  const handleBudgetCreate = async (newBudget) => {
    try {
      // Call the API to create a new budget
      const response = await createBudget(newBudget);

      // Update the budgets list with the new budget
      setBudgets((prev) => [...prev, { ...newBudget, id: response.id }]);
    } catch (error) {
      console.error("Failed to create budget:", error);
    }
  };

  return (
    <div>
    {userName ? (
      <div className="dashboard">
        <h1>Welcome, <span className="accent">{userName}</span></h1>
        <div className="grid-sm">
          {loading ? (
            <p>Loading budgets...</p>
          ) : (
            <div>
              <AddBudgetForm onBudgetCreate={handleBudgetCreate} />
              {budgets.length > 0 ? (
                budgets.map((budget) => (
                  <div key={budget.id}>
                    <h3>{budget.name}</h3>
                    <p>Amount: ${budget.amount}</p>
                  </div>
                ))
              ) : (
                <p>No budgets yet! Add one now!</p>
              )}
            </div>
          )}
        </div>
      </div>
    ) : (
      <Intro />
    )}
  </div>
);
};

export default Dashboard;
