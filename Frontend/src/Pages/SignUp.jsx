/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import '../Styles/SignIn.scss'

import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    phone: '',
    email: '',
    password: '',
    userType: 'Individual', // Default value
    role:'user',
  });

  const { name, cnic, phone, email, password, userType, role } = formData;

  // useEffect(() => {
  //   if (User?.role === 'superadmin') {
  //     navigate('/'); // Redirect to dashboard for superadmin
  //   }

  //   if (User?.role === 'admin') {
  //     navigate('/'); // Redirect to dashboard for admin
  //   }
  //   else if (User?.role === 'user') {
  //     navigate('/Payment');
  //   }

  // }, [User,navigate])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    try{
      console.log("Hello")
      // const response = await axios.post(`/api/v1/users/signup`, {
      //   name,
      //   cnic,
      //   phone,
      //   email,
      //   password,
      //   userType,
      //   role,
      // },{withCredentials:true});
      // updateUser(response.data.data.createdUser);
    }
    catch(err)
    {
      console.log(err);
    }
    // updateUser(formData);
    // navigate('/payment');
  };

  return (
    <div className="SignIn">
      <div className="left">
        {/* <img src={} alt="" /> */}
      </div>
    


      <div className="right">
        <div className="wrapper">
        <h1>Strong <span>legal </span>representation. One click away.</h1>
        <form onSubmit={handleSubmit}>

          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="cnic">CNIC:</label>
            <input
              type="number"
              id="cnic"
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

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

          <div>
            <label htmlFor="userType">Sign up as:</label>
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
          </div>

          <div className="btns">
            <button type="submit">Sign Up</button>
            <Link to='/login'>Already have an account? Login</Link>
          </div>

        </form>
      </div>
    </div>
    </div>
  )
}

export default SignUp