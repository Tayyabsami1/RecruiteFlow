/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import '../Styles/SignIn.scss'

import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {useDispatch} from 'react-redux'
import { setUserData } from '../Features/User/UserSlice';

import axios from 'axios';
import Logo from "../assets/Logo.jpg"

const SignUp = () => {

  const navigate = useNavigate();
  const [User,setUser]=useState({});
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    phone: '',
    email: '',
    password: '',
    userType: 'Jobseeker', // Default value
  });

  const { name, cnic, phone, email, password, userType } = formData;

  useEffect(() => {
    if (User?.userType === 'Admin') {
      navigate('/admin'); 
    }

    if (User?.userType === 'Recruiter') {
      console.log("Recruiter")
      navigate('/Recruiter'); 
    }
    else if (User?.userType === 'Jobseeker') {
      navigate('/');
    }

  }, [User,navigate])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    try{
      setUser(formData);
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
      dispatch(setUserData(formData));
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
        <div className='img'>
          <img src={Logo} alt="hello" />
        </div>
      </div>
    


      <div className="right">
        <div className="wrapper">
        <h1>Join  <span>RecruitFlow </span>where talent meets opportunity.</h1>
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
              <option value="Jobseeker">Job Seeker</option>
              <option value="Recruiter">Recruiter</option>
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