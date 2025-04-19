import { useEffect, useRef, useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './Pages/Login';

import SignUp from './Pages/SignUp';
import "./index.css"
import Layout from './Pages/Layout';
function App() {
  const [User, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  



  useEffect(() => {

    // Logic to check Authentication
    // const checkAuth = async () => {}

    // checkAuth();

  }, [])

  // const updateUser = (user) => {
    // setUser(user);
  // }

  const router= createBrowserRouter([
    {
      path:'/Admin',
      // element: User && User.role === 'admin' ? <h1>Admin Panel</h1> : <Navigate to='/Login' />,
      element: <h1>Admin Panel</h1>,
    //   children:[
    //     {
    //       path:'/Admin',
    //       element:<p>Component in Outlet</p>
    //     }
    //   ]
    },
    {
      path:'/Recruiter',
      // element: User && User.role === 'recruiter' ? <h1>Recruiter Panel</h1> : <Navigate to='/' />,
      element: <h1>Recruiter Panel</h1>,
    },
    // {
      // path:'/',
      // element: User && User.role === 'candidate' ? <h1>Candidate Panel</h1> : <Navigate to='/' />,
      // element: <h1>Home </h1>,
    // },
    {
      path:'/',
      element: <Layout/>,
      children:[
        {
          path:'/',
          element:<h1>Candidate Panel</h1>
        }
      ]
    },
    {
      path:'/Login',
      element: <Login/>,
    },
    {
      path:'/Signup',
      element:<SignUp/>
    }
  ])

  if(isLoading) return <h1>Loading...</h1>
  return (

    <RouterProvider router={router}/>

  )
}

export default App
