import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob } from '../../Features/Jobs/JobSlice';
import axios from 'axios';
import '../../Styles/PostJob.scss';
import { useMantineColorScheme } from '@mantine/core';
import { TextField, Autocomplete, Button, Typography, Box, CircularProgress } from '@mui/material';

const locationOptions = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Faisalabad', 'Rawalpindi'];
const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level'];
const industryOptions = ['Information Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing'];

const PostJob = () => {
  const dispatch = useDispatch();
  const { User } = useSelector((state) => state.User);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [RecruiterId, setRecruiterId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    experienceLevel: '',
    skills: [],
    industry: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setLoading(true);

    if (!RecruiterId) {
      alert('Recruiter ID not found. Please try again.');
      setLoading(false);
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

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error posting job:', err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }, [RecruiterId, title, location, experienceLevel, skills, industry, dispatch]);

  // Memoize the form rendering to prevent unnecessary re-renders
  const formContent = useMemo(() => (
    <form onSubmit={handleSubmit} className="postJobForm">      <TextField
        fullWidth
        label="Job Title"
        name="title"
        value={title}
        onChange={handleInputChange}
        required
        margin="normal"
        sx={{
          "& .MuiOutlinedInput-root": {
            color: isDark ? '#FFFFFF' : '#0F044C',
            "& fieldset": { borderColor: isDark ? 'rgba(238, 238, 238, 0.7)' : '#141E61' },
            "&:hover fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C' },
            "&.Mui-focused fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C', borderWidth: isDark ? 2 : 1 },
            bgcolor: isDark ? 'rgba(42, 36, 117, 0.6)' : 'rgba(238, 238, 238, 0.3)',
            backdropFilter: 'blur(5px)',
            borderRadius: '8px',
            "&::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' },
            "& input::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' }
          },
          "& .MuiInputLabel-root": {
            color: isDark ? '#FFFFFF' : '#0F044C'
          },
          "& .MuiInputBase-input::placeholder": { 
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)',
            opacity: 1
          }
        }}
      />      <Autocomplete
        freeSolo
        options={locationOptions}
        value={location}
        onChange={(_, value) => setFormData(prev => ({ ...prev, location: value }))}
        renderInput={(params) => (          <TextField 
            {...params} 
            label="Location" 
            required 
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: isDark ? '#FFFFFF' : '#0F044C',
                "& fieldset": { borderColor: isDark ? 'rgba(238, 238, 238, 0.7)' : '#141E61' },
                "&:hover fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C' },
                "&.Mui-focused fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C', borderWidth: isDark ? 2 : 1 },
                bgcolor: isDark ? 'rgba(42, 36, 117, 0.6)' : 'rgba(238, 238, 238, 0.3)',
                backdropFilter: 'blur(5px)',
                borderRadius: '8px',
                "&::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' },
                "& input::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' }
              },
              "& .MuiInputLabel-root": {
                color: isDark ? '#FFFFFF' : '#0F044C'
              },
              "& .MuiInputBase-input::placeholder": { 
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)',
                opacity: 1
              }
            }}
          />
        )}
        sx={{
          "& .MuiChip-root": {
            bgcolor: isDark ? 'rgba(200, 200, 255, 0.9)' : 'rgba(120, 122, 145, 0.2)',
            color: isDark ? '#0F044C' : '#0F044C',
            fontWeight: 600,
            border: isDark ? '1px solid #FFFFFF' : 'none',
            boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
          },
          "& .MuiChip-deleteIcon": {
            color: isDark ? '#0F044C' : '#787A91',
            "&:hover": {
              color: isDark ? '#141E61' : '#0F044C'
            }
          }
        }}
      />      <Autocomplete
        options={experienceLevels}
        value={experienceLevel}
        onChange={(_, value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
        renderInput={(params) => (          <TextField 
            {...params} 
            label="Experience Level" 
            required 
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: isDark ? '#FFFFFF' : '#0F044C',
                "& fieldset": { borderColor: isDark ? 'rgba(238, 238, 238, 0.7)' : '#141E61' },
                "&:hover fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C' },
                "&.Mui-focused fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C', borderWidth: isDark ? 2 : 1 },
                bgcolor: isDark ? 'rgba(42, 36, 117, 0.6)' : 'rgba(238, 238, 238, 0.3)',
                backdropFilter: 'blur(5px)',
                borderRadius: '8px',
                "&::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' },
                "& input::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' }
              },
              "& .MuiInputLabel-root": {
                color: isDark ? '#FFFFFF' : '#0F044C'
              },
              "& .MuiInputBase-input::placeholder": { 
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)',
                opacity: 1
              }
            }}
          />
        )}
        sx={{
          "& .MuiChip-root": {
            bgcolor: isDark ? 'rgba(200, 200, 255, 0.9)' : 'rgba(120, 122, 145, 0.2)',
            color: isDark ? '#0F044C' : '#0F044C',
            fontWeight: 600,
            border: isDark ? '1px solid #FFFFFF' : 'none',
            boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
          },
          "& .MuiChip-deleteIcon": {
            color: isDark ? '#0F044C' : '#787A91',
            "&:hover": {
              color: isDark ? '#141E61' : '#0F044C'
            }
          }
        }}
      />      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={skills}
        onChange={(e, value) => setFormData(prev => ({ ...prev, skills: value }))}
        renderInput={(params) => (          <TextField 
            {...params} 
            label="Skills (type and hit enter)" 
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: isDark ? '#FFFFFF' : '#0F044C',
                "& fieldset": { borderColor: isDark ? 'rgba(238, 238, 238, 0.7)' : '#141E61' },
                "&:hover fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C' },
                "&.Mui-focused fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C', borderWidth: isDark ? 2 : 1 },
                bgcolor: isDark ? 'rgba(42, 36, 117, 0.6)' : 'rgba(238, 238, 238, 0.3)',
                backdropFilter: 'blur(5px)',
                borderRadius: '8px',
                "&::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' },
                "& input::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' }
              },
              "& .MuiInputLabel-root": {
                color: isDark ? '#FFFFFF' : '#0F044C'
              },
              "& .MuiInputBase-input::placeholder": { 
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)',
                opacity: 1
              }
            }}
          />
        )}
        sx={{
          "& .MuiChip-root": {
            bgcolor: isDark ? 'rgba(200, 200, 255, 0.9)' : 'rgba(120, 122, 145, 0.2)',
            color: isDark ? '#0F044C' : '#0F044C',
            fontWeight: 600,
            border: isDark ? '1px solid #FFFFFF' : 'none',
            boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
          },
          "& .MuiChip-deleteIcon": {
            color: isDark ? '#0F044C' : '#787A91',
            "&:hover": {
              color: isDark ? '#141E61' : '#0F044C'
            }
          }
        }}
      />      <Autocomplete
        options={industryOptions}
        value={industry}
        onChange={(_, value) => setFormData(prev => ({ ...prev, industry: value }))}
        renderInput={(params) => (          <TextField 
            {...params} 
            label="Industry" 
            required 
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: isDark ? '#FFFFFF' : '#0F044C',
                "& fieldset": { borderColor: isDark ? 'rgba(238, 238, 238, 0.7)' : '#141E61' },
                "&:hover fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C' },
                "&.Mui-focused fieldset": { borderColor: isDark ? '#FFFFFF' : '#0F044C', borderWidth: isDark ? 2 : 1 },
                bgcolor: isDark ? 'rgba(42, 36, 117, 0.6)' : 'rgba(238, 238, 238, 0.3)',
                backdropFilter: 'blur(5px)',
                borderRadius: '8px',
                "&::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' },
                "& input::placeholder": { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)' }
              },
              "& .MuiInputLabel-root": {
                color: isDark ? '#FFFFFF' : '#0F044C'
              },
              "& .MuiInputBase-input::placeholder": { 
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 4, 76, 0.5)',
                opacity: 1
              }
            }}
          />
        )}
        sx={{
          "& .MuiChip-root": {
            bgcolor: isDark ? 'rgba(200, 200, 255, 0.9)' : 'rgba(120, 122, 145, 0.2)',
            color: isDark ? '#0F044C' : '#0F044C',
            fontWeight: 600,
            border: isDark ? '1px solid #FFFFFF' : 'none',
            boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
          },
          "& .MuiChip-deleteIcon": {
            color: isDark ? '#0F044C' : '#787A91',
            "&:hover": {
              color: isDark ? '#141E61' : '#0F044C'
            }
          }
        }}
      />      <Button 
        variant="contained" 
        type="submit" 
        disabled={loading}
        sx={{ 
          mt: 2,
          bgcolor: isDark ? '#EEEEEE' : '#141E61',
          color: isDark ? '#0F044C' : '#EEEEEE',
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '1rem',
          borderRadius: '8px',
          '&:hover': {
            bgcolor: isDark ? '#c9c9c9' : '#0F044C',
            transform: 'translateY(-2px)',
            boxShadow: isDark ? '0 4px 12px rgba(238, 238, 238, 0.3)' : '0 4px 12px rgba(15, 4, 76, 0.3)'
          },
          '&:disabled': {
            bgcolor: isDark ? 'rgba(238, 238, 238, 0.3)' : 'rgba(20, 30, 97, 0.3)',
            color: isDark ? 'rgba(15, 4, 76, 0.5)' : 'rgba(238, 238, 238, 0.5)'
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: isDark ? '#0F044C' : '#EEEEEE' }} />
        ) : (
          'Post Job'
        )}
      </Button>
      
      {success && (
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mt: 2, 
            color: isDark ? '#8AFF8A' : '#4CAF50',
            textAlign: 'center',
            fontWeight: 600,
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: isDark ? 'rgba(138, 255, 138, 0.1)' : 'rgba(76, 175, 80, 0.1)'
          }}
        >
          Job posted successfully!
        </Typography>
      )}
    </form>
  ), [title, location, experienceLevel, skills, industry, handleSubmit, handleInputChange, loading, success, isDark]);  return (
    <Box className={`postJob ${isDark ? 'dark-mode' : ''}`} sx={{ 
      maxWidth: 600, 
      mx: 'auto', 
      mt: 4,
      boxShadow: isDark ? '0 8px 20px rgba(0, 0, 0, 0.4)' : '0 5px 15px rgba(15, 4, 76, 0.15)',
      border: isDark ? '1px solid rgba(148, 150, 172, 0.5)' : 'none',
      borderRadius: '12px',
      overflow: 'hidden',
      background: isDark ? 'linear-gradient(145deg, #1A2177, #1A1464)' : '#EEEEEE'
    }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ 
          color: isDark ? '#EEEEEE' : '#0F044C', 
          fontWeight: 600,
          mt: 2,
          mb: 3,
          textShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        Post a New Job
      </Typography>
      {formContent}
    </Box>
  );
};

export default PostJob;
