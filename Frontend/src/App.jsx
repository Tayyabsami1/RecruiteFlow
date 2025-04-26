import { useEffect, useState, useMemo } from 'react'
import { createBrowserRouter, Link, Navigate, RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import "./index.css"

import { setUserData } from './Features/User/UserSlice';
import axios from 'axios';

import { Login,SignUp,Home,Layout } from './Pages';

function App() {
  
  const { User } = useSelector((state) => state.User);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => { 
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Auth`, { withCredentials: true });
        dispatch(setUserData(res.data.data));
        setIsLoading(false);
      }
      catch (err) {
        console.log(err.response.data.msg);
        setError(err.response.data.msg);
        dispatch(setUserData(null));
        setIsLoading(false);
      }
    }

    if (!User)
      checkAuth();
    else setIsLoading(false);
    console.log("Component mounted")


  }, [User, dispatch])


  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: '/Admin',
        element: User && User.userType === 'Admin' ? <h1>Admin Panel</h1> : <Navigate to='/' />,
        //   children:[
        //     {
        //       path:'/Admin',
        //       element:<p>Component in Outlet</p>
        //     }
        //   ]
      },
      {
        path: '/Recruiter',
        element:<Layout/>,
        children:[
          {
            path:'/Recruiter',
            element: User && User.userType === 'Recruiter' ? <Home/> : <Navigate to='/' />,
          }
        ]
        // element:<h1>hello </h1>
      },
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: '/',
            element: User?.userType === 'Recruiter' ? (
              <Navigate to='/Recruiter' />
            ) : User?.userType === 'Admin' ? (
              <Navigate to='/Admin' />
            ) : <Home/>
          }
        ]
      },
      {
        path: '/Login',
        element: <Login />,
      },
      {
        path: '/Signup',
        element: <SignUp />
      },
      {
        path:"*",
        element:error?<Navigate to='/Login'/>:<Navigate to='/'/>
      }
    ])
  }, [User,error])

  if (isLoading) return <h1>Loading...</h1>

  // if (error) return <Navigate to='/Login' />

  return <RouterProvider router={router} />

}

export default App
