
import { Form } from 'react-router-dom'
import React, { useState } from 'react';

const AddBudgetForm = ({ onBudgetCreate }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onBudgetCreate({ name, amount });
    setName('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Budget</h2>
      <div>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <button type="submit">Create Budget</button>
    </form>
  );
};

export default AddBudgetForm;
