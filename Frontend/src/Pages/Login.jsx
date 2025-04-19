/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import '../Styles/Login.scss'
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';

import axios from "axios"

const Login = () => {


  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

//   useEffect(() => {
//     if (User?.role === 'superadmin') {
//       navigate('/Admin'); // Redirect to dashboard for superadmin
//     }

//     if (User?.role === 'admin') {
//       navigate('/'); // Redirect to dashboard for admin
//     }
//     else if (User?.role === 'user') {
//       navigate('/Home');
//     }

//   }, [User,navigate])

  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
      console.log("Hello")
      // const response = await axios.post(`/api/v1/users/login`, {
        // email,
        // password,
      // });
    //   updateUser(response.data.data.LoggedInUser);
    }
    catch(err)
    {
      console.log(err);
    }
  };

  return (
    <div className="LogIn">
      <div className="left">
        <div className="wrapper">
          <h1>Access Your <span>Legal </span>matters</h1>
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

            {/* <div>
              <label htmlFor="userType">Log in as:</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="Individual">Individual</option>
                <option value="Startup">Startup</option>
                <option value="Corporation">Corporation</option>
              </select>
            </div> */}

            <div className="btns">
              <button type="submit" >Log in </button>
              <Link to='/signup'>Don't have an account? Sign up </Link>
            </div>

          </form>
        </div>
      </div>



      <div className="right">
        {/* <img src={BgImg} alt="" /> */}

      </div>
    </div>
  )
}

export default Login