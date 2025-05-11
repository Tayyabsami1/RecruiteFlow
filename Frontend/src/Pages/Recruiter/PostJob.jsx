import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob } from '../../Features/Jobs/JobSlice';
import axios from 'axios';
import '../../Styles/PostJob.scss';

import { TextField, Autocomplete, Button, Typography, Box } from '@mui/material';

const locationOptions = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Faisalabad', 'Rawalpindi'];
const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level'];
const industryOptions = ['Information Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing'];
//Above three arrays have options to be shown to user to enhance user experience

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

  useEffect(() => {
    const fetchRecruiterId = async () => {
      try {
        const res = await axios.get(`/api/recruiter/getRecruiterId/${User._id}`); //Same logic as in PostedJobs.jsx
        setRecruiterId(res.data.recruiterId);
      } catch (error) {
        console.error('Error fetching RecruiterId:', error);
      }
    };

    if (User?._id) {
      fetchRecruiterId();
    }
  }, [User]);

  const handleChange = (field) => (event, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target; //name is title here and value is the user input
    //console.log("Title", name, value)
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
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
          whoPosted: RecruiterId, //whoPosted field to store the reference of recruiter (recruiterId) so that it will be used to display the particular jobs of recruiter that he has posted.
        },
        { withCredentials: true }
      );

      dispatch(addJob(response.data.data.createdJob)); //It will store the job in store where we have jobs array.

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
  };

  return (
    <Box className="postJob" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Post a New Job
      </Typography>
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
          options={locationOptions} //This is a predefined list of options being shown to user (as suggestions) which is filtered based on the user input.
          value={location} //value is set with the default value from formData state.
          onChange={(_, value) => setFormData({ ...formData, location: value })} //here value is the final selected value input by the user.
          renderInput={(params) => <TextField {...params} label="Location" required margin="normal" />}
        />

        <Autocomplete
          options={experienceLevels}
          value={experienceLevel} 
          onChange={(_, value) => setFormData({ ...formData, experienceLevel: value })}
          renderInput={(params) => <TextField {...params} label="Experience Level" required margin="normal" />}
        />

        <Autocomplete
          multiple
          freeSolo 
          options={[]}
          value={skills}
          onChange={(e, value) => setFormData({ ...formData, skills: value })}
          renderInput={(params) => <TextField {...params} label="Skills (type and hit enter)" margin="normal" />}
        />

        <Autocomplete
          options={industryOptions}
          value={industry}
          onChange={(_, value) => setFormData({ ...formData, industry: value })}
          renderInput={(params) => <TextField {...params} label="Industry" required margin="normal" />}
        />

        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Post Job
        </Button>
      </form>
    </Box>
  );
};

export default PostJob;
