import { useLoaderData } from "react-router-dom";
import "../index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Intro from "../components/Intro";
import { toast } from "react-toastify";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import { createBudget } from "../helpers";
import { createExpense } from "../helpers";
import BudgetItem from "../components/BudgetItem";

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

  if (_action === 'createExpense') {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User not logged in!");
  
    // Extract the values from the form
    const expenseName = values.newExpense;
    const expenseAmount = values.newExpenseAmount;
    const budgetId = values.newExpenseBudget; // Assuming this is coming from the form
    
    // Validate input
    if (!expenseName || !expenseAmount || !budgetId) {
      throw new Error("All fields are required!");
    }
  
    try {
      const response = await axios.post("http://localhost:8080/api/create-expense", {
        name: expenseName,
        amount: expenseAmount,
        budget_id: budgetId, // Attach the budget ID to the expense
        user_id: userId, // Attach the userId to the expense

        
      });
  
      if (response.status === 200) {
        toast.success("Expense created successfully");
        return null;
      }
      else {
        throw new Error("Failed to create expense");
      }
    } catch (error) {
      console.error(error);
      throw new Error("There was a problem creating your expense");
    }
  }
}

const Dashboard = () => {
  const { userName, budgets: initialBudgets, expenses: initialExpenses } = useLoaderData();
  const [budgets, setBudgets] = useState(initialBudgets || []);
  const [expenses, setExpenses] = useState(initialExpenses || []);
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

  const handleExpenseCreate = async (newExpense) => {
    try {
      const response = await createExpense(newExpense);
        setExpenses((prev) => [...prev, { ...newExpense, id: response.data.id}]);
        toast.success("Expense created successfully");
    }
     catch (error) {
      console.error("Failed to create expense:", error);
      toast.error("There was an issue creating the expense");
    
  };
  }
  return (
    <div>
    {userName ? (
      <div className="dashboard">
        <h1>Welcome to <span style={{color: "aqua"}}>Fin</span>
        <span style={{color:"#EDBF03"}}>Sight</span>
         
          </h1>
        <div className="grid-sm">
          {loading ? (
            <p>Loading budgets...</p>
          ) : (
            <div className="grid-sm">
              
              <AddBudgetForm onBudgetCreate={handleBudgetCreate} />
              {budgets.length > 0 ? (
                budgets.map((budget) => (
                  <div key={budget.id}>
                    
                  </div>
                ))
              ) : (
                <p>No budgets yet! Add one now!</p>
              )}
              <AddExpenseForm budgets={budgets} onExpenseCreate={handleExpenseCreate} />
            </div>
            
          )}
          <h2>Existing Budgets:</h2>
          <div className="budgets">
            {
              budgets.map((budget) => (
                <BudgetItem key={budget.id} budget={budget} />
              ))
            }
          </div>
        </div>
      </div>
    ) : (
      <Intro />
    )}
  </div>
);
};

export default Dashboard;
