import { useEffect, useRef, useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import axios from 'axios'

function App() {
  const [User, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    // Logic to check Authentication
    const checkAuth = async () => {}

    checkAuth();

  }, [])

  const updateUser = (user) => {
    setUser(user);
  }

  const router= createBrowserRouter([
    {
      path:'/Admin',
      element: User && User.role === 'admin' ? <h1>Admin Panel</h1> : <Navigate to='/Home' />,
      children:[
        {
          path:'/Admin',
          children:<p>Component in Outlet</p>
        }
      ]
    },
    {
      path:'/Recruiter',
      element: User && User.role === 'recruiter' ? <h1>Recruiter Panel</h1> : <Navigate to='/Home' />,
    },
    {
      path:'/Candidate',
      element: User && User.role === 'candidate' ? <h1>Candidate Panel</h1> : <Navigate to='/Home' />,
    },
    {
      path:'/Home',
      element: <h1>Home</h1>,
    },
    {
      path:'/Login',
      element: <h1>Login</h1>,
    },
    {
      path:'/Signup',
      element:<h1>Signup</h1>
    }
  ])

  if(isLoading) return <h1>Loading...</h1>
  return (

    <RouterProvider router={router}/>

  )
}

export default App
