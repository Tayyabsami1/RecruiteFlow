import React from 'react';
import "../../Styles/Admin/Home.scss";
import { Box, Typography, Grid, Paper } from '@mui/material';
import { AreaChart, DonutChart } from '@mantine/charts';
import {  LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import {  RingProgress, Text } from '@mantine/core';
import { Person, BusinessCenter, AccessTime } from '@mui/icons-material';

import { useMantineColorScheme } from '@mantine/core';

const Home = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  // Current time for greeting
  const currentHour = new Date().getHours();

  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good Evening";
  }

  // Dummy data for statistics
  const stats = [
    { title: "Total Jobs", value: 256, icon: <BusinessCenter fontSize="large" />, color: "#141E61" },
    { title: "Total Recruiters", value: 84, icon: <Person fontSize="large" />, color: "#0F044C" },
    { title: "Job Seekers", value: 1243, icon: <Person fontSize="large" />, color: "#787A91" },
    { title: "Jobs Posted Today", value: 12, icon: <AccessTime fontSize="large" />, color: "#141E61" }
  ];

  // Dummy data for charts
  const monthlyApplicationsData = [
    { name: 'Jan', applications: 65 },
    { name: 'Feb', applications: 59 },
    { name: 'Mar', applications: 80 },
    { name: 'Apr', applications: 81 },
    { name: 'May', applications: 56 },
    { name: 'Jun', applications: 55 },
    { name: 'Jul', applications: 40 },
    { name: 'Aug', applications: 70 },
    { name: 'Sep', applications: 90 },
    { name: 'Oct', applications: 110 },
    { name: 'Nov', applications: 105 },
    { name: 'Dec', applications: 120 },
  ];

  const jobCategoryData = [
    { name: 'IT & Software', value: 400, color: `${isDark ? '#EEEEEE' : '#0F044C'}` },
    { name: 'Design', value: 300, color: '#141E61' },
    { name: 'Marketing', value: 300, color: '#787A91' },
    { name: 'Finance', value: 200, color: `${isDark ? '#0F044C' : '#EEEEEE'}` },
  ];

  const userGrowthData = [
    { date: 'Jan', users: 400 },
    { date: 'Feb', users: 580 },
    { date: 'Mar', users: 700 },
    { date: 'Apr', users: 850 },
    { date: 'May', users: 910 },
    { date: 'Jun', users: 1050 },
  ];

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
                <Legend  />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke={'#141E61'}
                  fill={ 'rgba(20, 30, 97, 0.2)'}
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

        {/* Box to hold Small Graphs  */}
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
                      sections={[{ value: 84, color: `${isDark ? '#EEEEEE' : '#141E61'}` }]}
                      label={
                        <Text size="lg" ta="center" fw={700}>
                          84%
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
                      sections={[{ value: 92, color: '#787A91' }]}
                      label={
                        <Text size="lg" ta="center" fw={700}>
                          92%
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