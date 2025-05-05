import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/JobSeeker/JobsList.scss";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { useMantineColorScheme } from "@mantine/core";
import { 
  CircularProgress, 
  Chip, 
  Paper, 
  Typography, 
  Button,
  TextField,
  MenuItem,
  Box,
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Container
} from "@mui/material";
import { WorkOutline, LocationOn, Stars, Code, Business } from "@mui/icons-material";

const JobsList = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const { User } = useSelector((state) => state.User);
  const [JobSeekerId, setJobSeekerId] = useState(null);
  
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterBy, setFilterBy] = useState("title"); 
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setappliedJobs] = useState([]);
  const [isRecommended, setIsRecommended] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (recommended = false) => {
    try {
      setLoading(true);
      if(JobSeekerId){
        const url = recommended 
          ? `/api/jobseeker/ai/recommended-jobs/${JobSeekerId}`
          : `/api/job/get-jobs/${JobSeekerId}`;
        const res = await axios.get(url);
        // Ensure jobs is always an array, even if empty
        const jobsData = res.data?.jobs || [];
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setIsRecommended(recommended);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
      setFilteredJobs([]);
      toast.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const fetchJobSeekerId=async()=>{
      try {
        const res1=await axios.get(`/api/jobseeker/getJobSeekerId/${User._id}`);
        setJobSeekerId(res1.data.jobSeekerId);
      } catch (error) {
        console.error("Error fetching JobSeekerId:", error);
      }
    };

    fetchJobSeekerId();
  },[])

  useEffect(() => {
    fetchJobs();
  }, [JobSeekerId]);

  const toggleJobsView = () => {
    fetchJobs(!isRecommended);
  };

  const handleApply = async (jobId, isApplied) => {
    try {
      if (!isApplied) {
        await axios.put(`/api/job/apply/${jobId}`, { userId: JobSeekerId});
        toast("Applied Successfully!");
        setappliedJobs([...appliedJobs,jobId]);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) => {
        if (filterBy === "skills") {
          return job.skills.some((skill) =>
            skill.toLowerCase().includes(value.toLowerCase())
          );
        } else if (filterBy === "location") {
          return job.location.toLowerCase().includes(value.toLowerCase());
        } else {
          return job[filterBy]?.toLowerCase().includes(value.toLowerCase());
        }
      });
      setFilteredJobs(filtered);
    }
  };

  return (
    <Container maxWidth="xl" className={`jobs-list-container ${isDark ? 'dark-mode' : ''}`}>
      <ToastContainer />
      <Box className="header-container" sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ 
          fontWeight: 'bold', 
          color: isDark ? '#EEEEEE' : '#0F044C'
        }}>
          {isRecommended ? 'Recommended Jobs' : 'Available Jobs'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={toggleJobsView}
          sx={{ 
            bgcolor: isDark ? '#141E61' : '#0F044C',
            '&:hover': {
              bgcolor: isDark ? '#787A91' : '#141E61',
            },
            color: '#EEEEEE',
            fontWeight: 'bold',
            borderRadius: '8px',
            px: 3,
            py: 1
          }}
        >
          {isRecommended ? 'All Jobs' : 'Recommended Jobs'}
        </Button>
      </Box>

      <Paper elevation={3} className="search-filter" sx={{ 
        p: 2, 
        mb: 4,
        bgcolor: isDark ? '#141E61' : '#EEEEEE',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
      }}>
        <TextField
          select
          label="Filter By"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          sx={{ 
            minWidth: { xs: '100%', sm: '200px' },
            "& .MuiOutlinedInput-root": {
              color: isDark ? '#EEEEEE' : '#0F044C',
              "& fieldset": { borderColor: isDark ? '#787A91' : '#141E61' },
              "&:hover fieldset": { borderColor: isDark ? '#EEEEEE' : '#0F044C' },
            },
            "& .MuiInputLabel-root": {
              color: isDark ? '#EEEEEE' : '#0F044C'
            },
            "& .MuiSelect-icon": {
              color: isDark ? '#EEEEEE' : '#0F044C'
            }
          }}
        >
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="location">Location</MenuItem>
          <MenuItem value="experienceLevel">Experience Level</MenuItem>
          <MenuItem value="skills">Skills</MenuItem>
          <MenuItem value="industry">Industry</MenuItem>
        </TextField>

        <TextField
          label={`Search by ${filterBy}`}
          variant="outlined"
          value={searchText}
          onChange={handleSearch}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              color: isDark ? '#EEEEEE' : '#0F044C',
              "& fieldset": { borderColor: isDark ? '#787A91' : '#141E61' },
              "&:hover fieldset": { borderColor: isDark ? '#EEEEEE' : '#0F044C' },
            },
            "& .MuiInputLabel-root": {
              color: isDark ? '#EEEEEE' : '#0F044C'
            }
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px' 
        }}>
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ 
              color: isDark ? '#EEEEEE' : '#0F044C' 
            }} 
          />
        </Box>
      ) : (
        <Grid container spacing={3} className="jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const isApplied = appliedJobs.includes(job._id);       
              
              return (
                <Grid item xs={12} sm={6} md={4} key={job._id}>
                  <Card 
                    elevation={3} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      bgcolor: isDark ? '#141E61' : '#EEEEEE',
                      borderRadius: '16px',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom 
                        sx={{ 
                          color: isDark ? '#EEEEEE' : '#0F044C',
                          fontWeight: 'bold',
                          mb: 2
                        }}
                      >
                        {job.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <LocationOn sx={{ color: isDark ? '#787A91' : '#141E61', mr: 1 }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: isDark ? '#EEEEEE' : '#141E61'
                          }}
                        >
                          {job.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <WorkOutline sx={{ color: isDark ? '#787A91' : '#141E61', mr: 1 }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: isDark ? '#EEEEEE' : '#141E61'
                          }}
                        >
                          {job.experienceLevel}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Business sx={{ color: isDark ? '#787A91' : '#141E61', mr: 1 }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: isDark ? '#EEEEEE' : '#141E61'
                          }}
                        >
                          {job.industry}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2, bgcolor: isDark ? '#787A91' : '#141E61' }} />
                      
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Code sx={{ color: isDark ? '#787A91' : '#141E61', mr: 1 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: isDark ? '#EEEEEE' : '#141E61',
                              fontWeight: 'bold'
                            }}
                          >
                            Skills
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {job.skills.map((skill, index) => (
                            <Chip 
                              key={index} 
                              label={skill} 
                              size="small" 
                              sx={{ 
                                bgcolor: isDark ? '#0F044C' : '#787A91',
                                color: '#EEEEEE',
                                fontWeight: 'medium'
                              }} 
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={isApplied}
                        onClick={() => handleApply(job._id, isApplied)}
                        sx={{
                          bgcolor: isApplied ? '#787A91' : '#0F044C',
                          color: '#EEEEEE',
                          '&:hover': {
                            bgcolor: isApplied ? '#787A91' : '#141E61',
                          },
                          py: 1,
                          fontWeight: 'bold',
                          borderRadius: '8px'
                        }}
                      >
                        {isApplied ? "Applied" : "Apply Now"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Paper 
                elevation={1} 
                sx={{ 
                  textAlign: 'center',
                  p: 4,
                  bgcolor: isDark ? '#141E61' : '#EEEEEE',
                  borderRadius: '12px'
                }}
                className="no-jobs-message"
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDark ? '#EEEEEE' : '#0F044C',
                    fontWeight: 'medium'
                  }}
                >
                  {isRecommended 
                    ? "No recommended jobs found. Try updating your skills and preferred locations in your profile." 
                    : "No jobs available matching your search criteria."}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default JobsList;