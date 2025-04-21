/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import '../Styles/Login.scss'
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';
import Logo from "../assets/Logo.jpg"
import axios from "axios"
import { useSelector,useDispatch } from 'react-redux';
import { setUserData } from '../Features/User/UserSlice';

const Login = () => {

  const navigate = useNavigate();
  const {User}= useSelector((state)=>state.User);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (User?.userType === 'Admin') {
      navigate('/Admin'); 
    }

    if (User?.userType === 'Recruiter') {
      navigate('/Recruiter'); 
    }
    else if (User?.userType === 'Jobseeker') {
      navigate('/');
    }

  }, [User,navigate,dispatch])

  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

    dispatch(setUserData(response.data.data.LoggedInUser));

    }
    catch(err)
    {
      console.log(err.response.data.msg);
    }
  };

  return (
    <div className="LogIn">
      <div className="left">
        <div className="wrapper">
          <h1>Welcome back — let's get you <span> hired! </span></h1>
          <form onSubmit={handleSubmit}>

            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="btns">
              <button type="submit" >Log in </button>
              <Link to='/signup'>Don't have an account? Sign up </Link>
            </div>

          </form>
        </div>
      </div>



      <div className="right">
        <div className="img">
        <img src={Logo} alt="" />
        </div>

      </div>
    </div>
  )
}

export default Login