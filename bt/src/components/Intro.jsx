import React from 'react'
import { Form } from 'react-router-dom'
import money from "../assets/money.png"

function Intro() {
  return (
    <div className='intro'>
        <div>
            <h1>
                Take Control of <span className='accent'> Your Money</span>
            </h1>
            <p>Personal budgeting is the secret to your financial freedom.</p>
            <Form method="post">
                <input 
                type='text' 
                name='userName' 
                required placeholder='Your Name' 
                aria-label='Your Name' 
                autoComplete='given-name' 
                />
                <button type='submit' className='btn btn--dark'>
                    <span>Create Account</span>
                </button>
            </Form>
            
        </div>
        <img src={money} alt='money' width={600} />
    </div>
  )
}

export default Intro