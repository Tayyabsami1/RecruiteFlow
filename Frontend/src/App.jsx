import { useEffect, useState, useMemo } from 'react'
import { createBrowserRouter, Link, Navigate, RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import PostJob from './Pages/Recruiter/PostJob';//added by Imran Ahmad
import RecruiterProfile from './Pages/Recruiter/RecruiterProfile'; // Adjust path if needed
import AllApplicants from './Pages/Recruiter/AllApplicants'; // Import AllApplicants
import RecruiterDashboard from './Pages/Recruiter/Dashboard'; // Import Recruiter Dashboard


import "./index.css"

import { setUserData } from './Features/User/UserSlice';
import axios from 'axios';

import { Login, SignUp, Home, Layout, About, AdminLayout, AdminHome,CompleteProfile,Dashboard,JobList,ManageUsers, ManageJobs } from './Pages';

import ProtectedRoute from './Components/ProtectedRoute';
import PostedJobs from './Pages/Recruiter/PostedJobs';

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

        element: User && User.userType === 'Admin' ? <AdminLayout/>: <Navigate to='/' />,
          children:[
            {
              path:'/Admin',
              element:<AdminHome/>
            },
            {
              path:'users',
              element:<ManageUsers/>
            },
            {
              path:'jobs',
              element:<ManageJobs/>
            }
          ]
      },
      {
        path: '/Recruiter',
        element: User && User.userType === 'Recruiter' ? <Layout /> : <Navigate to='/' />,        children: [
          {
            path: '/Recruiter',
            element: <Home />,
          },
          {
            path: 'dashboard',
            element: <RecruiterDashboard />,
          },
          {
            path: 'post-job', // added by Imran Ahmad
            element: <PostJob />,
          },
          {
            path: 'postedjobs', // added by Imran Ahmad
            element: <PostedJobs/>
          },
          {
            path: 'job/:jobId/applicants', // New route for viewing applicants
            element: <AllApplicants />
          },
          {
            path: 'profile', 
            element: (
              <ProtectedRoute>
                <RecruiterProfile />
              </ProtectedRoute>
            )
          }
        ]
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
            ) :  <Home />

          },
          {
            path: 'profile',
            element: <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>,
          },
          {
            path: 'jobs',
            element:
              <ProtectedRoute>
                <JobList/>
              </ProtectedRoute>,
          },
          {
            path: 'dashboard',
            element:
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>,
          },
          {
            path: '/about',
            element: <About />
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
        path: "*",
        element: error ? <Navigate to='/Login' /> : <Navigate to='/' />
      }
    ])
  }, [User, error])

  if (isLoading) return <h1>Loading...</h1>

  // if (error) return <Navigate to='/Login' />

  return <RouterProvider router={router} />

}

export default App