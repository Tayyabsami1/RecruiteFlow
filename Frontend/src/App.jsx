import { useEffect, useState } from 'react'
import { createBrowserRouter, Link, Navigate, RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import Login from './Pages/Login';

import SignUp from './Pages/SignUp';
import "./index.css"
import Layout from './Pages/Layout';
import { setUserData } from './Features/User/UserSlice';
import axios from 'axios';
function App() {
  const { User } = useSelector((state) => state.User);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // ! Important Code 
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Auth`, { withCredentials: true });
        dispatch(setUserData(res.data.data));
        setIsLoading(false);

      }
      catch (err) {
        console.log(err.response.data.msg);
        setError(err.response.data.msg);
        setIsLoading(false);
      }

    }

    if(!User)
    checkAuth();
    else setIsLoading(false);
    console.log(User)


  }, [User,dispatch])

  // const updateUser = (user) => {
  // setUser(user);
  // }

  const router = createBrowserRouter([
    {
      path: '/Admin',
      element: User && User.userType === 'admin' ? <h1>Admin Panel</h1> : <Navigate to='/' />,
      //   children:[
      //     {
      //       path:'/Admin',
      //       element:<p>Component in Outlet</p>
      //     }
      //   ]
    },
    {
      path: '/Recruiter',
      element: User && User.userType === 'Recruiter' ? <h1>Recruiter Panel</h1> : <Navigate to='/' />,
      // element:<h1>hello fuck u</h1>
    },
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <h1>
            Candidate Panel
            {User && <p>Logout plz if you want no pressure </p>}
            <br></br>
            {!User && <Link to='/Login' > Login</Link>}
          </h1>
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
    }
  ])

  if(error) <Navigate to='/Login'/>
  if (isLoading) return <h1>Loading...</h1>
  else
  return (

    <RouterProvider router={router} />

  )
}

export default App
