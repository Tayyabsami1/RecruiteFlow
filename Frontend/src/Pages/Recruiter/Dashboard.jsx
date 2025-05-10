import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMantineColorScheme } from '@mantine/core';
import '../../Styles/Recruiter/Dashboard.scss';

import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Paper,
    Divider,
    CircularProgress,
} from '@mui/material';

import {
    Business,
    WorkOutline,
    LocationOn,
    Code,
    PeopleOutlined,
    Assignment,
    TrendingUp,
    CalendarToday,
    Star
} from '@mui/icons-material';

const Dashboard = () => {
    const { User } = useSelector((state) => state.User);
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const navigate = useNavigate();

    const [recruiterId, setRecruiterId] = useState(null);
    const [postedJobs, setPostedJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [metrics, setMetrics] = useState({
        totalJobs: 0,
        activeJobs: 0,
        shortlistedCandidates: 0,
        interviewedCandidates: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecruiterId = async () => {
            try {
                const res = await axios.get(`/api/recruiter/getRecruiterId/${User._id}`);
                setRecruiterId(res.data.recruiterId);
            } catch (error) {
                console.error("Error fetching RecruiterId:", error);
                setLoading(false);
            }
        };

        if (User?._id) fetchRecruiterId();
    }, [User]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch posted jobs
                const jobsRes = await axios.get(`/api/job/get-posted-jobs/${recruiterId}`);
                const jobs = jobsRes.data.jobs || [];

                // Sort jobs by creation date (newest first) and take only 3
                const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPostedJobs(sortedJobs.slice(0, 3));

                // Compute metrics
                const activeJobs = jobs.filter(job => job.status === 'open').length;

                // Calculate total applicants, shortlisted and interviewed candidates
                let applicantsCount = 0;
                let shortlistedCount = 0;
                let interviewedCount = 0;

                jobs.forEach(job => {
                    if (job.whoApplied) applicantsCount += job.whoApplied.length;
                    if (job.shortlisted) shortlistedCount += job.shortlisted.length;
                    if (job.interviewed) interviewedCount += job.interviewed.length;
                });

                setTotalApplicants(applicantsCount);
                setMetrics({
                    totalJobs: jobs.length,
                    activeJobs,
                    shortlistedCandidates: shortlistedCount,
                    interviewedCandidates: interviewedCount
                });

                // Get recent applications across all jobs (last 10)
                let allApplicants = [];
                for (const job of jobs) {
                    if (job.whoApplied && job.whoApplied.length > 0) {
                        // For simplicity, we're assuming the application contains necessary details
                        // In a real implementation, you might need to fetch user details for each applicant
                        const jobApplicants = job.whoApplied.map(applicantId => ({
                            applicantId,
                            jobId: job._id,
                            jobTitle: job.title,
                            applicationDate: job.createdAt // this would ideally be the application date
                        }));
                        allApplicants = [...allApplicants, ...jobApplicants];
                    }
                }

                // Sort by date and take most recent 5
                allApplicants.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
                setRecentApplications(allApplicants.slice(0, 5));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (recruiterId) fetchDashboardData();
    }, [recruiterId]);

    // Render a metric card
    const renderMetricCard = (title, value, icon, color) => {
        return (
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    borderRadius: '16px',
                    bgcolor: isDark ? '#141E61' : '#EEEEEE',
                    boxShadow: isDark ? '0 8px 16px rgba(0, 0, 0, 0.4)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: isDark ? '0 12px 20px rgba(0, 0, 0, 0.5)' : '0 12px 20px rgba(0, 0, 0, 0.15)'
                    }
                }}
            >
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 70,
                            width: 70,
                            borderRadius: '50%',
                            bgcolor: isDark ? '#0F044C' : color,
                            mb: 2
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography
                        variant="h3"
                        component="div"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: isDark ? '#EEEEEE' : '#0F044C'
                        }}
                    >
                        {value}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            color: isDark ? '#787A91' : '#141E61',
                            fontWeight: 'medium'
                        }}
                    >
                        {title}
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    // Render job card
    const renderJobCard = (job) => {
        return (
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
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5,
                                width: '100%',
                                px: 2
                            }}
                        >
                            <LocationOn
                                sx={{
                                    color: isDark ? '#787A91' : '#141E61',
                                    mr: 1,
                                    minWidth: '24px'
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: isDark ? '#EEEEEE' : '#141E61'
                                }}
                            >
                                {job.location}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5,
                                width: '100%',
                                px: 2
                            }}
                        >
                            <WorkOutline
                                sx={{
                                    color: isDark ? '#787A91' : '#141E61',
                                    mr: 1,
                                    minWidth: '24px'
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: isDark ? '#EEEEEE' : '#141E61'
                                }}
                            >
                                {job.experienceLevel}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5,
                                width: '100%',
                                px: 2
                            }}
                        >
                            <Business
                                sx={{
                                    color: isDark ? '#787A91' : '#141E61',
                                    mr: 1,
                                    minWidth: '24px'
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: isDark ? '#EEEEEE' : '#141E61'
                                }}
                            >
                                {job.industry}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5,
                                width: '100%',
                                px: 2
                            }}
                        >
                            <PeopleOutlined
                                sx={{
                                    color: isDark ? '#787A91' : '#141E61',
                                    mr: 1,
                                    minWidth: '24px'
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: isDark ? '#EEEEEE' : '#141E61'
                                }}
                            >
                                {job.whoApplied ? job.whoApplied.length : 0} Applicants
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2, bgcolor: isDark ? '#787A91' : '#141E61' }} />

                    <Box sx={{ mt: 2, width: '100%', px: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5,
                                width: '100%'
                            }}
                        >
                            <Code
                                sx={{
                                    color: isDark ? '#787A91' : '#141E61',
                                    mr: 1,
                                    minWidth: '24px'
                                }}
                            />
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
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                ml: '24px',
                                pl: 1
                            }}
                        >
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
                <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/Recruiter/job/${job._id}/applicants`)}
                        sx={{
                            bgcolor: isDark ? '#0F044C' : '#141E61',
                            color: '#EEEEEE',
                            '&:hover': {
                                bgcolor: isDark ? '#141E61' : '#0F044C',
                            },
                            py: 1,
                            px: 3,
                            fontWeight: 'bold',
                            borderRadius: '8px'
                        }}
                    >
                        View Applicants
                    </Button>
                </CardActions>
            </Card>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 100px)'
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: isDark ? '#EEEEEE' : '#0F044C'
                    }}
                />
            </Box>
        );
    }
    return (
        <Container
            maxWidth="xl"
            disableGutters
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                pb: 8,
                width: '100%',
                maxWidth: '100%'
            }}
            className={`dashboard ${isDark ? 'dark-mode' : ''}`}
        >      <Box
            sx={{
                mb: 6,
                textAlign: 'center',
                width: '100%'
            }}
        >
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: isDark ? '#EEEEEE' : '#0F044C',
                        mb: 2
                    }}
                >
                    Recruiter Dashboard
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: isDark ? '#787A91' : '#141E61',
                        mb: 4
                    }}
                >
                    Manage your recruitment activities and track applicants
                </Typography>
            </Box>      {/* Metrics Section */}
            <Box sx={{ mb: 6, width: '100%' }}>
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        fontWeight: 'bold',
                        color: isDark ? '#EEEEEE' : '#0F044C',
                        mb: 3,
                        textAlign: 'center'
                    }}
                >          Recruitment Overview
                </Typography>
                <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid item xs={12} sm={6} md={3}>
                        {renderMetricCard(
                            'Total Jobs',
                            metrics.totalJobs,
                            <Assignment sx={{ fontSize: 40, color: '#EEEEEE' }} />,
                            '#141E61'
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        {renderMetricCard(
                            'Active Jobs',
                            metrics.activeJobs,
                            <TrendingUp sx={{ fontSize: 40, color: '#EEEEEE' }} />,
                            '#0F044C'
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        {renderMetricCard(
                            'Total Applicants',
                            totalApplicants,
                            <PeopleOutlined sx={{ fontSize: 40, color: '#EEEEEE' }} />,
                            '#141E61'
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        {renderMetricCard(
                            'Candidates Shortlisted',
                            metrics.shortlistedCandidates,
                            <Star sx={{ fontSize: 40, color: '#EEEEEE' }} />,
                            '#0F044C'
                        )}
                    </Grid>
                </Grid>
            </Box>      {/* Recent Jobs Section */}
            <Box sx={{ mb: 6, width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        justifyContent: 'center',
                        gap: 10
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assignment sx={{ fontSize: 32, color: isDark ? '#787A91' : '#0F044C', mr: 1.5 }} />
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                fontWeight: 'bold',
                                color: isDark ? '#EEEEEE' : '#0F044C'
                            }}
                        >
                            Recent Jobs
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/Recruiter/postedjobs')}
                        sx={{
                            color: isDark ? '#EEEEEE' : '#0F044C',
                            borderColor: isDark ? '#EEEEEE' : '#0F044C',
                            '&:hover': {
                                borderColor: isDark ? '#EEEEEE' : '#0F044C',
                                bgcolor: isDark ? 'rgba(238, 238, 238, 0.08)' : 'rgba(15, 4, 76, 0.08)'
                            }
                        }}
                    >            View All Jobs
                    </Button>
                </Box>
                <Grid container spacing={3} justifyContent="center" sx={{ width: '100%' }}>
                    {postedJobs.length > 0 ? (
                        postedJobs.map((job) => (
                            <Grid item xs={12} sm={6} md={4} key={job._id}>
                                {renderJobCard(job)}
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
                                        fontWeight: 'medium',
                                        mb: 2
                                    }}
                                >
                                    No jobs posted yet.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/Recruiter/post-job')}
                                    sx={{
                                        bgcolor: isDark ? '#0F044C' : '#141E61',
                                        color: '#EEEEEE',
                                        '&:hover': {
                                            bgcolor: isDark ? '#141E61' : '#0F044C',
                                        },
                                        py: 1,
                                        px: 3,
                                        fontWeight: 'bold',
                                        borderRadius: '8px'
                                    }}
                                >
                                    Post Your First Job
                                </Button>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Recent Applications Section */}
            <Box sx={{ mb: 6 }}>        <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleOutlined sx={{ fontSize: 32, color: isDark ? '#787A91' : '#0F044C', mr: 1.5  ,alignItems:'center'}} />
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 'bold',
                            color: isDark ? '#EEEEEE' : '#0F044C'
                        }}
                    >
                        Recent Applications            
                        </Typography>
                </Box>
            </Box>
                <Grid container spacing={3} justifyContent="center" sx={{ width: '100%' }}>
                    {recentApplications.length > 0 ? (
                        <Grid item xs={12}>
                            <Paper
                                elevation={3}
                                sx={{
                                    overflow: 'hidden',
                                    bgcolor: isDark ? '#141E61' : '#EEEEEE',
                                    borderRadius: '16px'
                                }}
                            >                <Box sx={{ p: 3 }}>
                                    {recentApplications.map((application, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                p: 3,
                                                borderBottom: index < recentApplications.length - 1 ?
                                                    (isDark ? '1px solid #0F044C' : '1px solid #787A91') : 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: { xs: 'flex-start', sm: 'center' },
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                gap: { xs: 5, sm: 3 },
                                                '&:hover': {
                                                    bgcolor: isDark ? '#0F044C' : 'rgba(120, 122, 145, 0.1)'
                                                },
                                                borderRadius: '8px',
                                                mb: 1
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: isDark ? '#EEEEEE' : '#0F044C',
                                                        fontSize: '1.1rem'
                                                    }}
                                                >
                                                    {application.jobTitle}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: isDark ? '#787A91' : '#141E61',
                                                        mt: 1
                                                    }}
                                                >
                                                    <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                                    {formatDate(application.applicationDate)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="medium"
                                                onClick={() => navigate(`/Recruiter/job/${application.jobId}/applicants`)}
                                                sx={{
                                                    bgcolor: isDark ? '#0F044C' : '#141E61',
                                                    color: '#EEEEEE',
                                                    borderColor: isDark ? '#EEEEEE' : '#0F044C',
                                                    width: { xs: '100%', sm: 'auto' },
                                                    py: 1,
                                                    px: 3,
                                                    '&:hover': {
                                                        bgcolor: isDark ? '#141E61' : '#0F044C',
                                                    }
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
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
                                    No applications received yet.
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Quick Actions Section */}
            <Box sx={{ mb: 6 }}>
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        fontWeight: 'bold',
                        color: isDark ? '#EEEEEE' : '#0F044C',
                        mb: 3, textAlign: 'center'
                    }}
                >
                    Quick Actions
                </Typography>
                <Grid container spacing={3} justifyContent="center" sx={{ width: '100%' }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
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
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 3,
                                    flexGrow: 1
                                }}
                            >
                                <Assignment sx={{ fontSize: 60, color: isDark ? '#EEEEEE' : '#0F044C', mb: 2 }} />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: isDark ? '#EEEEEE' : '#0F044C',
                                        mb: 1,
                                        textAlign: 'center'
                                    }}
                                >
                                    Post a New Job
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: isDark ? '#787A91' : '#141E61',
                                        textAlign: 'center',
                                        mb: 2
                                    }}
                                >
                                    Create a new job listing to attract the best candidates
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate('/Recruiter/post-job')}
                                    sx={{
                                        bgcolor: isDark ? '#0F044C' : '#141E61',
                                        color: '#EEEEEE',
                                        '&:hover': {
                                            bgcolor: isDark ? '#141E61' : '#0F044C',
                                        },
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        mt: 'auto'
                                    }}
                                >
                                    Create Job
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
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
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 3,
                                    flexGrow: 1
                                }}
                            >
                                <Business sx={{ fontSize: 60, color: isDark ? '#EEEEEE' : '#0F044C', mb: 2 }} />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: isDark ? '#EEEEEE' : '#0F044C',
                                        mb: 1,
                                        textAlign: 'center'
                                    }}
                                >
                                    Update Company Profile
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: isDark ? '#787A91' : '#141E61',
                                        textAlign: 'center',
                                        mb: 2
                                    }}
                                >
                                    Keep your company information up-to-date to attract candidates
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate('/Recruiter/profile')}
                                    sx={{
                                        bgcolor: isDark ? '#0F044C' : '#141E61',
                                        color: '#EEEEEE',
                                        '&:hover': {
                                            bgcolor: isDark ? '#141E61' : '#0F044C',
                                        },
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        mt: 'auto'
                                    }}
                                >
                                    Update Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
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
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 3,
                                    flexGrow: 1
                                }}
                            >
                                <PeopleOutlined sx={{ fontSize: 60, color: isDark ? '#EEEEEE' : '#0F044C', mb: 2 }} />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: isDark ? '#EEEEEE' : '#0F044C',
                                        mb: 1,
                                        textAlign: 'center'
                                    }}
                                >
                                    View Posted Jobs
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: isDark ? '#787A91' : '#141E61',
                                        textAlign: 'center',
                                        mb: 2
                                    }}
                                >
                                    Manage your job listings and review applicants
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate('/Recruiter/postedjobs')}
                                    sx={{
                                        bgcolor: isDark ? '#0F044C' : '#141E61',
                                        color: '#EEEEEE',
                                        '&:hover': {
                                            bgcolor: isDark ? '#141E61' : '#0F044C',
                                        },
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        mt: 'auto'
                                    }}
                                >
                                    Manage Jobs
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard;