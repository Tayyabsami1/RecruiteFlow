import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../Styles/Recruiter/RecruiterProfile.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';
import { useMantineColorScheme } from '@mantine/core';

const RecruiterProfile = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { User } = useSelector((state) => state.User);
  const [recruiterData, setRecruiterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [designation, setDesignation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  useEffect(() => {
    const fetchRecruiterProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/recruiter/get-profile/${User._id}`,{ withCredentials: true });
        setRecruiterData(res.data);

        setCompanyName(res.data.companyName || '');
        setDesignation(res.data.designation || '');
        setContactNumber(res.data.contactNumber || '');
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterProfile();
  }, [User._id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('designation', designation);
    formData.append('contactNumber', contactNumber);
    if (companyLogo) formData.append('companyLogo', companyLogo);

    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/recruiter/update-profile/${User._id}`, formData,{withCredentials:true}, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Profile Updated Successfully!");
      setRecruiterData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme={isDark ? "dark" : "light"} />
      <div className={`recruiter-profile-container ${isDark ? 'dark-mode' : ''}`}>
        <h2>Recruiter Profile</h2>

        {loading ? (
          <div className="loading-container">
            <CircularProgress style={{ color: isDark ? "#EEEEEE" : "#0F044C" }} />
            <p>Loading profile information...</p>
          </div>
        ) : (
          <>
            <section className="basic-info">
              <h3>Basic Information</h3>
              <p><strong>Name:</strong> {User.name}</p>
              <p><strong>Email:</strong> {User.email}</p>
              <p><strong>Phone:</strong> {User.phone}</p>
              <p><strong>CNIC:</strong> {User.cnic}</p>
              <p><strong>User Type:</strong> {User.userType}</p>
            </section>

            <section className="company-info">
              <h3>Company Details</h3>
              {recruiterData ? (
                <>
                  <p><strong>Company Name:</strong> {recruiterData.companyName || 'Not specified'}</p>
                  <p><strong>Designation:</strong> {recruiterData.designation || 'Not specified'}</p>
                  <p><strong>Contact Number:</strong> {recruiterData.contactNumber || 'Not specified'}</p>
                  <p><strong>Company Logo:</strong> 
                    {recruiterData.companyLogo ? (
                      <img src={`http://localhost:3000/${recruiterData.companyLogo}`} alt="Company Logo" width={100} />
                    ) : ' No logo uploaded.'}
                  </p>
                </>
              ) : <p>No company details available yet. Complete your profile below.</p>}
            </section>

            <section className="update-form">
              <h3>Update Profile</h3>
              <form onSubmit={handleSubmit} className="profile-form">
                <label>Company Name:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                />

                <label>Designation:</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Your Designation"
                />

                <label>Contact Number:</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Contact Number"
                />

                <label>Upload Company Logo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCompanyLogo(e.target.files[0])}
                />

                <button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <CircularProgress size={20} color="inherit" style={{ marginRight: '8px' }} />
                      Updating...
                    </>
                  ) : "Update Profile"}
                </button>
              </form>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default RecruiterProfile;
