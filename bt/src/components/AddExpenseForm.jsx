import React, { useEffect, useState } from 'react'
import { useFetcher } from 'react-router-dom'
import { useRef } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import { createExpense } from '../helpers'

const AddExpenseForm = ({budgets, onExpenseCreate}) => {
    const fetcher = useFetcher()
    const formRef = useRef()
    const focusRef = useRef()

    const [name, setName] = useState(''); // Store name input
    const [amount, setAmount] = useState(''); // Store amount input
    const [budget_id, setBudgetId] = useState(''); // Store budgetId input
    
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if(!isSubmitting) {
            formRef.current.reset()
            focusRef.current.focus()
        }
    }, [isSubmitting])

    useEffect(() => {
        if (budgets.length === 1) {
            // Automatically set the budget_id if there's only one budget
            setBudgetId(budgets[0].id);
        }
        if (!isSubmitting) {
            formRef.current.reset();
            focusRef.current.focus();
        }
    }, [isSubmitting, budgets]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !amount || !budget_id) {
            toast.error('Please fill out all fields');
            return;
          }
      
          const expenseData = {
            name,
            amount: parseFloat(amount), // Ensure amount is a number
            budget_id,
            user_id: localStorage.getItem('userId'), // Assuming user_id comes from localStorage
          };
      
          setIsSubmitting(true);  // Disable submit button while submitting
      
          try {
            await onExpenseCreate(expenseData);  // Pass the expense data to the handler
            setName('');   // Reset the form after submitting
            setAmount('');
            setBudgetId('');
            toast.success('Expense created successfully');
          } catch (error) {
            console.error('Failed to create expense:', error);
            toast.error('There was an issue creating the expense');
          } finally {
            setIsSubmitting(false);  // Enable submit button again after the operation is complete
          }
    };

  return (
    <div className='form-wrapper'>
        <h2 className='h3'>Add New <span className='accent'> {budgets.length === 1 && `${budgets.map((budg) => budg.name)}`} </span> Expense</h2>

        <fetcher.Form method="post"
        className='grid-sm'
        ref={formRef}
        onSubmit={handleSubmit}
        >
            <div className='expense-inputs'>
                <div className='grid-xs'>
                    <label htmlFor='newExpense'>Expense Name:</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} name="newExpense" id='newExpense' placeholder='e.g., Coffee' ref={focusRef} required />
                </div>
                <div className='grid-xs'>
                    <label htmlFor='newExpenseAmount'>Amount:</label>
                    <input value={amount} onChange={(e) => setAmount(e.target.value)} type='number' step='0.01' inputMode='decimal' name='newExpenseAmount' id='newExpenseAmount' placeholder='e.g., 2.50' required/>

                </div>
            </div>
        <div className='grid-xs' >
            <label htmlFor='newExpenseBudget'>Budget Category</label>
            <select value={budget_id} name='newExpenseBudget' id='newExpenseBudget' 
            onChange={ (e) => {
                
                setBudgetId(e.target.value);
            }} 
            required>
                {
                    budgets
                    .sort((a,b) => a.createdAt - b.createdAt)
                    .map((budget) => {
                        return (
                            <option key={budget.id} value={budget.id}>
                                {budget.name}
                            </option>
                        )
                    })
                }
            </select>
        </div>
        <input type='hidden' name='_action' value='createExpense' />
        <button type='submit' className='btn btn--dark' disabled={isSubmitting}>
            {
                isSubmitting ? <span>Submitting...</span>
                : (
                    <>
                        <span>Add Expense</span>
                        
                    </>
                )
            }
        </button>
        </fetcher.Form>
    </div>
  )
}

export default AddExpenseForm