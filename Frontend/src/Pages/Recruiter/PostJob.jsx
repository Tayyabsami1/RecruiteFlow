import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob } from '../../Features/Jobs/JobSlice';
import axios from 'axios';
import '../../Styles/PostJob.scss';

import { TextField, Autocomplete, Button, Typography, Box } from '@mui/material';

const locationOptions = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Faisalabad', 'Rawalpindi'];
const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level'];
const industryOptions = ['Information Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing'];

const PostJob = () => {
  const dispatch = useDispatch();
  const { User } = useSelector((state) => state.User);

  const [RecruiterId, setRecruiterId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    experienceLevel: '',
    skills: [],
    industry: '',
  });

  const { title, location, experienceLevel, skills, industry } = formData;

  // Optimized with useCallback
  const fetchRecruiterId = useCallback(async () => {
    try {
      const res = await axios.get(`/api/recruiter/getRecruiterId/${User._id}`);
      setRecruiterId(res.data.recruiterId);
    } catch (error) {
      console.error('Error fetching RecruiterId:', error);
    }
  }, [User._id]);
  useEffect(() => {
    if (User?._id) {
      fetchRecruiterId();
    }
  }, [User, fetchRecruiterId]);

  // Optimized with useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  // Optimized with useCallback
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!RecruiterId) {
      alert('Recruiter ID not found. Please try again.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/job/postjob`,
        {
          title,
          location,
          experienceLevel,
          skills,
          industry,
          whoPosted: RecruiterId,
        },
        { withCredentials: true }
      );

      dispatch(addJob(response.data.data.createdJob));

      setFormData({
        title: '',
        location: '',
        experienceLevel: '',
        skills: [],
        industry: '',
      });

      alert('Job posted successfully!');
    } catch (err) {
      console.error('Error posting job:', err.response?.data?.msg || err.message);
    }
  }, [RecruiterId, title, location, experienceLevel, skills, industry, dispatch]);

  // Memoize the form rendering to prevent unnecessary re-renders
  const formContent = useMemo(() => (
    <form onSubmit={handleSubmit} className="postJobForm">
      <TextField
        fullWidth
        label="Job Title"
        name="title"
        value={title}
        onChange={handleInputChange}
        required
        margin="normal"
      />

      <Autocomplete
        freeSolo
        options={locationOptions}
        value={location}
        onChange={(_, value) => setFormData(prev => ({ ...prev, location: value }))}
        renderInput={(params) => <TextField {...params} label="Location" required margin="normal" />}
      />

      <Autocomplete
        options={experienceLevels}
        value={experienceLevel}
        onChange={(_, value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
        renderInput={(params) => <TextField {...params} label="Experience Level" required margin="normal" />}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={skills}
        onChange={(e, value) => setFormData(prev => ({ ...prev, skills: value }))}
        renderInput={(params) => <TextField {...params} label="Skills (type and hit enter)" margin="normal" />}
      />

      <Autocomplete
        options={industryOptions}
        value={industry}
        onChange={(_, value) => setFormData(prev => ({ ...prev, industry: value }))}
        renderInput={(params) => <TextField {...params} label="Industry" required margin="normal" />}
      />

      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        Post Job
      </Button>
    </form>
  ), [title, location, experienceLevel, skills, industry, handleSubmit, handleInputChange]);

  return (
    <Box className="postJob" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Post a New Job
      </Typography>
      {formContent}
    </Box>
  );
};

export default PostJob;
