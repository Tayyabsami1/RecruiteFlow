import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../Styles/Recruiter/RecruiterProfile.scss';
import { ToastContainer, toast } from 'react-toastify';

const RecruiterProfile = () => {
  const { User } = useSelector((state) => state.User);
  const [recruiterData, setRecruiterData] = useState(null);

  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [designation, setDesignation] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const fetchRecruiterProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/recruiter/get-profile/${User._id}`);
        setRecruiterData(res.data);

        setCompanyName(res.data.companyName || '');
        setDesignation(res.data.designation || '');
        setContactNumber(res.data.contactNumber || '');
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecruiterProfile();
  }, [User._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('designation', designation);
    formData.append('contactNumber', contactNumber);
    if (companyLogo) formData.append('companyLogo', companyLogo);

    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/recruiter/update-profile/${User._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast("Profile Updated Successfully!");
      setRecruiterData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="recruiter-profile-container">
        <h2>Recruiter Profile</h2>

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
              <p><strong>Company Name:</strong> {recruiterData.companyName}</p>
              <p><strong>Designation:</strong> {recruiterData.designation}</p>
              <p><strong>Contact Number:</strong> {recruiterData.contactNumber}</p>
              <p><strong>Company Logo:</strong> 
                {recruiterData.companyLogo ? (
                  <img src={`http://localhost:3000/${recruiterData.companyLogo}`} alt="Company Logo" width={100} />
                ) : ' No logo uploaded.'}
              </p>
            </>
          ) : <p>Loading company details...</p>}
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

            <button type="submit">Update Profile</button>
          </form>
        </section>
      </div>
    </>
  );
};

export default RecruiterProfile;
