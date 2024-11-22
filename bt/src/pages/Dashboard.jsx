// rrd imports
// rrd imports
import { useLoaderData } from "react-router-dom";
import "../index.css"
//  helper functions
import { createBudget, fetchData } from "../helpers"
import Intro from "../components/Intro";
import { toast } from "react-toastify";
import AddBudgetForm from "../components/AddBudgetForm";
// loader
export function dashboardLoader() {
  const userName = fetchData("userName");
  const budgets = fetchData("budgets");
  return { userName, budgets }
}

export async function dashboardAction({request}) {
  const data = await request.formData();
  const {_action, ...values} = Object.fromEntries(data)

  if(_action === 'newUser') {
    try {
    localStorage.setItem("userName", JSON.stringify(values.userName))
    return toast.success('Welcome ')
  }
  catch(e) {
    throw new Error ("There was a problem creating your account.")
  }
  }
if(_action === 'createBudget') {
  try {
    createBudget({
      name: values.newBudget,
      amount: values.newBudgetAmount,
    })
    return toast.success("Budget created successfully")
  }
  catch(e) {
    throw new Error("There was a problem creating your budget")
  }
}

  
}

const Dashboard = () => {
  const { userName, budgets } = useLoaderData()

  return (
    <div>
      {userName ? (
        <div className="dashboard">
          <h1>Welcome back, <span className="accent">{userName}</span></h1>
          <div className="grid-sm">
            <div className="grid-lg">
              <div className="flex-lg">
                <AddBudgetForm />
              </div>
            </div>
          </div>
        </div>
      ) : <Intro />}
      
    </div>
  )
}
export default Dashboard