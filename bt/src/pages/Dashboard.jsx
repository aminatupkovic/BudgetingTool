import { useLoaderData } from "react-router-dom";
import "../index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Intro from "../components/Intro";
import { toast } from "react-toastify";
import AddBudgetForm from "../components/AddBudgetForm";

// Loader
export function dashboardLoader() {
  return {}; // Placeholder if loader logic is needed later
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
      if (response.status === 201) {
        toast.success("Welcome!");
      }
    } catch (error) {
      throw new Error("There was a problem creating your account.");
    }
  }

  if (_action === "createBudget") {
    try {
      const response = await axios.post("http://localhost:8080/api/create-budget", {
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });
      if (response.status === 201) {
        toast.success("Budget created successfully");
      }
    } catch (error) {
      throw new Error("There was a problem creating your budget");
    }
  }
}

const Dashboard = () => {
  const { userName } = useLoaderData(); // Placeholder for loader data
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user budgets from the backend
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/get-budgets");
      setBudgets(response.data.budgets || []);
    } catch (error) {
      toast.error("Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div>
      {userName ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {loading ? (
              <p>Loading budgets...</p>
            ) : (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm refreshBudgets={fetchBudgets} />
                </div>
                <div>
                  {budgets.length > 0 ? (
                    budgets.map((budget) => (
                      <div key={budget.id}>
                        <h3>{budget.name}</h3>
                        <p>Amount: {budget.amount}</p>
                      </div>
                    ))
                  ) : (
                    <p>No budgets available. Add one now!</p>
                  )}
                </div>
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
