import axios from 'axios';

// Backend API URL
const API_URL = 'http://localhost:8080/api';

// Function to fetch data (GET request)
export const fetchData = async (url) => {
  try {
    const response = await axios.get(`${API_URL}/${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Function to create a budget (POST request)
export const createBudget = async ({ name, amount, userId }) => {
  try {
    const budgetData = { name, amount, userId };
    const response = await axios.post(`${API_URL}/create-budget`, budgetData);
    return response.data; // Returns success message from the server
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

export const createExpense = async ({ name, amount, budget_id, user_id }) => {
  try {
    const expenseData = { name, amount, budget_id, user_id };
    const response = await axios.post(`${API_URL}/create-expense`, expenseData);
    return response; // Returns success message from the server
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

// Function to create a user (POST request)
export const createUser = async (userName) => {
  try {
    const response = await axios.post(`${API_URL}/create-user`, { userName });
    localStorage.setItem('userName', userName);
    return response.data; // { message: 'User created successfully', userId }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Function to generate a random color (used for budget color)
const generateRandomColor = () => {
  return `${Math.floor(Math.random() * 360)} 65% 50%`;
}

// Function to delete an item from the local storage (just an example, not used in the new setup)
export const deleteItem = (key) => {
  return localStorage.removeItem(key);
}

// Mock "wait" function (for some delay)
export const waait = () => new Promise(res => setTimeout(res, Math.random() * 800));