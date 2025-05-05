import React, { useState, useEffect } from 'react';
import "../../Styles/Admin/Home.scss";
import { Box, Typography, Grid, Paper } from '@mui/material';
import { AreaChart, DonutChart } from '@mantine/charts';
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { RingProgress, Text } from '@mantine/core';
import { Person, BusinessCenter } from '@mui/icons-material';
import axios from 'axios';
import { useMantineColorScheme } from '@mantine/core';
import { CircularProgress } from '@mui/material';

const Home = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  // Current time for greeting
  const currentHour = new Date().getHours();
  const [statsData, setStatsData] = useState({
    totalJobs: 0,
    totalRecruiters: 0,
    totalJobSeekers: 0
  });
  const [monthlyApplicationsData, setMonthlyApplicationsData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [jobCategoryData, setJobCategoryData] = useState([]);
  const [systemPerformance, setSystemPerformance] = useState({
    uptime: 0,
    responseRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good Evening";
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/Admin/Stats');
        const {
          totalJobs,
          totalRecruiters,
          totalJobSeekers,
          monthlyApplicationsData,
          userGrowthData,
          jobCategoryData,
          systemPerformance
        } = response.data.data;

        setStatsData({
          totalJobs,
          totalRecruiters,
          totalJobSeekers
        });

        // Set the new data from our enhanced API
        setMonthlyApplicationsData(monthlyApplicationsData || []);
        setUserGrowthData(userGrowthData || []);
        setJobCategoryData(jobCategoryData || []);
        setSystemPerformance(systemPerformance || { uptime: 0, responseRate: 0 });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Stats data using real values from API
  const stats = [
    { title: "Total Jobs", value: statsData.totalJobs, icon: <BusinessCenter fontSize="large" />, color: "#141E61" },
    { title: "Total Recruiters", value: statsData.totalRecruiters, icon: <Person fontSize="large" />, color: "#0F044C" },
    { title: "Job Seekers", value: statsData.totalJobSeekers, icon: <Person fontSize="large" />, color: "#787A91" }
  ];

  // Render loading state
  if (isLoading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography variant="h6" className="loading-text">Loading Statistics</Typography>
      </Box>
    );
  }

  return (
    <div className="admin-home">
      <Box className={`greeting-section ${isDark ? 'dark-mode' : ''}`}>
        <Typography variant="h4" className="greeting-text">
          {greeting}, Admin!
        </Typography>
        <Typography variant="subtitle1" className="date-text">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {/* Stats Grid Container to put them in one Row */}
      <Grid container spacing={3} className="stats-container">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <Typography variant="h5" className="stat-value">{stat.value}</Typography>
                <Typography variant="body2" className="stat-title">{stat.title}</Typography>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid spacing={3} className="charts-container">
        {/* Grid for Monthly Application */}
        <Grid item xs={12} md={8}>
          <Paper className="chart-paper">
            <Typography variant="h6" className="chart-title">Monthly Job Applications</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                h={3000}
                data={monthlyApplicationsData}
                dataKey='name'
                series={[{ name: 'applications', color: 'indigo' }]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke={'#141E61'}
                  fill={'rgba(20, 30, 97, 0.2)'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Grid for User Growth */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-paper">
            <Typography variant="h6" className="chart-title">User Growth</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={userGrowthData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#141E61"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Box to hold Small Graphs */}
        <Box className='small-charts-container'>
          {/*Job Category Graph */}
          <Grid item xs={12} md={4}>
            <Paper className="chart-paper">
              <Typography variant="h6" className="chart-title">Jobs by Category</Typography>
              <Box className="donut-chart">
                <DonutChart
                  data={jobCategoryData}
                  size={220}
                  thickness={30}
                  chartLabel="Jobs"
                  withTooltip={true}
                />
              </Box>
            </Paper>
          </Grid>

          {/* System Performance Graph */}
          <Grid item xs={12} md={6}>
            <Paper className="chart-paper">
              <Typography variant="h6" className="chart-title">System Performance</Typography>
              <Grid container spacing={2} className="performance-metrics">
                <Grid item xs={6}>
                  <Box className="metric-container">
                    <RingProgress
                      size={150}
                      thickness={12}
                      roundCaps
                      sections={[{ value: systemPerformance.uptime, color: `${isDark ? '#EEEEEE' : '#141E61'}` }]}
                      label={
                        <Text size="lg" ta="center" fw={700}>
                          {systemPerformance.uptime}%
                        </Text>
                      }
                    />
                    <Typography variant="body2" className="metric-label">System Uptime</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className="metric-container">
                    <RingProgress
                      size={150}
                      thickness={12}
                      roundCaps
                      sections={[{ value: systemPerformance.responseRate, color: '#787A91' }]}
                      label={
                        <Text size="lg" ta="center" fw={700}>
                          {systemPerformance.responseRate}%
                        </Text>
                      }
                    />
                    <Typography variant="body2" className="metric-label">Response Rate</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </div>
  );
};

export default Home;