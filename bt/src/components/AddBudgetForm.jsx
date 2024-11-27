
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
  <div className='form-wrapper'>
   <h2 className='h3'>Create a Budget</h2>
    <form onSubmit={handleSubmit}>
      
      <div className='grid-xs'>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className='grid-xs'>
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <input type="hidden" name="_action" value="createBudget" />
      <button className='btn btn--dark' type="submit">Create Budget</button>
    </form>
  </div>
    
    
  );
};

export default AddBudgetForm;
