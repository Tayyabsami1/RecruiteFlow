/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import '../Styles/Login.scss'
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';
import Logo from "../assets/Logo.jpg"
import axios from "axios"

const Login = () => {


  const navigate = useNavigate();
  const [User, setUser] = useState(null);

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

  }, [User,navigate])

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log("Hello")
    // try{
      // const response = await axios.post(`/api/v1/users/login`, {
        // email,
        // password,
      // });
    //   updateUser(response.data.data.LoggedInUser);
    setUser(formData);
    setUser(prev=>({...prev, userType: "Jobseeker"}));

    // }
    // catch(err)
    // {
      // console.log(err);
    // }
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