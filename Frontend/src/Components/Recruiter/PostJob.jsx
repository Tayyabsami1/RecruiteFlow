/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addJob } from '../../Features/Jobs/JobSlice';
import axios from 'axios';
import '../../Styles/PostJob.scss';

const PostJob = () => {
    const dispatch = useDispatch();
  
    const [formData, setFormData] = useState({
      title: '',
      location: '',
      experienceLevel: '',
      skills: '',
      industry: '',
    });
  
    const { title, location, experienceLevel, skills, industry } = formData;
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const skillsArray = skills.split(',').map(skill => skill.trim());
  
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/job/postjob`,
          {
            title,
            location,
            experienceLevel,
            skills: skillsArray,
            industry,
            // No need to include whoApplied, shortlisted, rejected (they will default to empty arrays in the backend)
          },
          { withCredentials: true }
        );
  
        dispatch(addJob(response.data.data.createdJob));
  
        // Optionally reset form after success
        setFormData({
          title: '',
          location: '',
          experienceLevel: '',
          skills: '',
          industry: '',
        });
  
        alert('Job posted successfully!');
      } catch (err) {
        console.error('Error posting job:', err.response?.data?.msg || err.message);
      }
    };
  
    return (
      <div className="postJob">
        <h2>Post a New Job</h2>
        <form className="postJobForm" onSubmit={handleSubmit}>
  
          <label htmlFor="title">
            Job Title:
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              required
            />
          </label>
  
          <label htmlFor="location">
            Location:
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={handleChange}
              required
            />
          </label>
  
          <label htmlFor="experienceLevel">
            Experience Level:
            <input
              type="text"
              id="experienceLevel"
              name="experienceLevel"
              value={experienceLevel}
              onChange={handleChange}
              required
            />
          </label>
  
          <label htmlFor="skills">
            Skills (comma separated):
            <input
              type="text"
              id="skills"
              name="skills"
              value={skills}
              onChange={handleChange}
              required
            />
          </label>
  
          <label htmlFor="industry">
            Industry:
            <input
              type="text"
              id="industry"
              name="industry"
              value={industry}
              onChange={handleChange}
              required
            />
          </label>
  
          <button className="submitBtn" type="submit">Post Job</button>
  
        </form>
      </div>
    );
  };
  
  export default PostJob;