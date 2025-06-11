import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../Styles/JobSeeker/Dashboard.scss";
import { useMantineColorScheme } from "@mantine/core";
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Chip,
  CircularProgress
} from '@mui/material';
import {
  LocationOn,
  WorkOutline,
  Business,
  Code,
  Assignment,
  CheckCircle,
  VideoCall
} from '@mui/icons-material';

const Dashboard = () => {
  const { User } = useSelector((state) => state.User);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [jobSeekerId, setJobSeekerId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [shortlistedJobs, setShortlistedJobs] = useState([]);
  const [interviewedJobs, setInterviewedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobSeekerId = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/jobseeker/getJobSeekerId/${User._id}`,{withCredentials: true});
        setJobSeekerId(res.data.jobSeekerId);
      } catch (error) {
        console.error("Error fetching job seeker id:", error);
        setLoading(false);
      }
    };

    if (User) {
      fetchJobSeekerId();
    }
  }, [User]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/job/UserDashboard/${jobSeekerId}`,
          {withCredentials:true}
        );
        setAppliedJobs(res.data.appliedJobs);
        setShortlistedJobs(res.data.shortlistedJobs);
        setInterviewedJobs(res.data.interviewedJobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    if (jobSeekerId) {
      fetchDashboardData();
    }
  }, [jobSeekerId]);

  // Helper function to render job status section
  const renderJobSection = (jobs, title, icon) => {
    return (
      <Box sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          justifyContent: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' , justifyContent:'center' }}>
            {icon}
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold', 
                color: isDark ? '#EEEEEE' : '#0F044C',
                ml: 1.5
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={3} justifyContent="center">
          {jobs.length > 0 ? (
            jobs.map((job) => (
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
                      component="h3" 
                      gutterBottom 
                      sx={{ 
                        color: isDark ? '#EEEEEE' : '#0F044C',
                        fontWeight: 'bold',
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      {job.title}
                    </Typography>
                    
                    <Box sx={{ width: '100%', mb: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1.5,
                        width: '100%',
                        px: 2
                      }}>
                        <LocationOn sx={{ 
                          color: isDark ? '#787A91' : '#141E61', 
                          mr: 1,
                          minWidth: '24px'
                        }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: isDark ? '#EEEEEE' : '#141E61'
                          }}
                        >
                          {job.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1.5,
                        width: '100%',
                        px: 2
                      }}>
                        <WorkOutline sx={{ 
                          color: isDark ? '#787A91' : '#141E61', 
                          mr: 1,
                          minWidth: '24px'
                        }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: isDark ? '#EEEEEE' : '#141E61'
                          }}
                        >
                          {job.experienceLevel}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1.5,
                        width: '100%',
                        px: 2
                      }}>
                        <Business sx={{ 
                          color: isDark ? '#787A91' : '#141E61', 
                          mr: 1,
                          minWidth: '24px'
                        }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: isDark ? '#EEEEEE' : '#141E61'
                          }}
                        >
                          {job.industry}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2, bgcolor: isDark ? '#787A91' : '#141E61' }} />
                    
                    <Box sx={{ mt: 2, width: '100%', px: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1.5,
                        width: '100%'
                      }}>
                        <Code sx={{ 
                          color: isDark ? '#787A91' : '#141E61', 
                          mr: 1,
                          minWidth: '24px'
                        }} />
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
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 1,
                        ml: '24px',
                        pl: 1
                      }}>
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
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12} sm={10} md={8}>
              <Paper 
                elevation={1} 
                sx={{ 
                  textAlign: 'center',
                  p: 4,
                  bgcolor: isDark ? '#141E61' : '#EEEEEE',
                  borderRadius: '12px',
                  mx: 'auto'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDark ? '#EEEEEE' : '#0F044C',
                    fontWeight: 'medium'
                  }}
                >
                  {`No ${title.toLowerCase()} yet.`}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ 
        pt: 4, 
        pb: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)'
      }} className={`dashboard ${isDark ? 'dark-mode' : ''}`}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ 
              color: isDark ? '#EEEEEE' : '#0F044C' 
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDark ? '#EEEEEE' : '#0F044C',
              mt: 2
            }}
          >
            Loading your dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      pt: 4, 
      pb: 8,
      mx: 'auto'
    }} className={`dashboard ${isDark ? 'dark-mode' : ''}`}>
      <Box sx={{ 
        mb: 6,
        textAlign: 'center'
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: isDark ? '#EEEEEE' : '#0F044C',
            mb: 2
          }}
        >
          Job Application Dashboard
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: isDark ? '#787A91' : '#141E61',
            mb: 4
          }}
        >
          Track your job application progress
        </Typography>
      </Box>

      {renderJobSection(
        appliedJobs, 
        "Applied Jobs", 
        <Assignment sx={{ fontSize: 32, color: isDark ? '#787A91' : '#0F044C' }} />
      )}
      
      {renderJobSection(
        shortlistedJobs, 
        "Shortlisted Jobs", 
        <CheckCircle sx={{ fontSize: 32, color: isDark ? '#787A91' : '#0F044C' }} />
      )}
      
      {renderJobSection(
        interviewedJobs, 
        "Interviewed Jobs", 
        <VideoCall sx={{ fontSize: 32, color: isDark ? '#787A91' : '#0F044C' }} />
      )}
    </Container>
  );
};

export default Dashboard;