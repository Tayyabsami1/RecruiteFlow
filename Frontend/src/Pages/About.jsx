import React from 'react';
import { Container, Title, Text, Grid, Paper, Timeline, ThemeIcon, List, Avatar, Group, Stack, Space, Divider } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { MdOutlineBusinessCenter, MdOutlinePeopleAlt, MdOutlineSpeed, MdOutlineSecurity, MdHistory, MdCheckCircle } from 'react-icons/md';
import '../Styles/About.scss';

const About = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const features = [
    {
      title: 'Streamlined Recruitment',
      icon: <MdOutlineBusinessCenter size={24} />,
      description: 'Simplify your hiring process with our intuitive tools designed to find the best talent efficiently.'
    },
    {
      title: 'Candidate Matching',
      icon: <MdOutlinePeopleAlt size={24} />,
      description: 'Our AI-powered matching algorithm helps you find candidates that perfectly fit your job requirements.'
    },
    {
      title: 'Fast Processing',
      icon: <MdOutlineSpeed size={24} />,
      description: 'Save time with automated screening and application processing to focus on what matters most.'
    },
    {
      title: 'Data Security',
      icon: <MdOutlineSecurity size={24} />,
      description: 'We prioritize the security of your data with industry-standard encryption and privacy measures.'
    }
  ];

  const teamMembers = [
    {
      name: 'Alex Johnson',
      position: 'Founder & CEO',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Sarah Williams',
      position: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Michael Chen',
      position: 'Head of Product',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Emily Rodriguez',
      position: 'Lead Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  return (
    <div className={`about-page ${isDark ? 'dark-mode' : ''}`}>
      {/* Hero Start */}
      <div className={`hero-section ${isDark ? 'dark-mode' : ''}`}>
        <Container size="lg">
          <Title order={1}>About RecruiteFlow</Title>
          <Text className="hero-subtitle">Revolutionizing the recruitment process for businesses and job seekers alike</Text>
        </Container>
      </div>
      {/* Hero End */}

      <Container size="lg" className={`main-content ${isDark ? 'dark-mode' : ''}`}>
        
        <section className={`mission-section ${isDark ? 'dark-mode' : ''}`}>
          <Title order={2} className="section-title">Our Mission</Title>
          <Text className="section-text">
            At RecruiteFlow, we're dedicated to transforming the recruitment landscape by leveraging cutting-edge technology 
            to connect employers with the perfect candidates. Our platform streamlines the hiring process, making it more 
            efficient, transparent, and effective for everyone involved.
          </Text>
        </section>

        <section className={`features-section ${isDark ? 'dark-mode' : ''}`}>
          <Title order={2} className="section-title">What We Offer</Title>
          <Grid>
            {features.map((feature, index) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={index}>
                <Paper className={`feature-card ${isDark ? 'dark-mode' : ''}`} p="md" radius="md">
                  <ThemeIcon size="xl" radius="md" className="feature-icon">
                    {feature.icon}
                  </ThemeIcon>
                  <Title order={3} className="feature-title">{feature.title}</Title>
                  <Text className="feature-description">{feature.description}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </section>

        <section className={`history-section ${isDark ? 'dark-mode' : ''}`}>
          <Title order={2} className="section-title">Our Journey</Title>
          <Timeline active={4} bulletSize={24} lineWidth={2}>
            <Timeline.Item bullet={<MdHistory size={16} />} title="Founded in 2020">
              <Text className="timeline-text">RecruiteFlow was established with a vision to revolutionize recruitment.</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<MdHistory size={16} />} title="First Platform Launch - 2021">
              <Text className="timeline-text">Launched our initial platform serving small to medium businesses.</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<MdHistory size={16} />} title="Expanded Services - 2022">
              <Text className="timeline-text">Introduced AI-powered matching and advanced analytics tools.</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<MdHistory size={16} />} title="Global Expansion - 2023">
              <Text className="timeline-text">Extended our services to international markets.</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<MdHistory size={16} />} title="Present Day - 2025">
              <Text className="timeline-text">Serving thousands of companies and job seekers worldwide.</Text>
            </Timeline.Item>
          </Timeline>
        </section>

        <section className={`values-section ${isDark ? 'dark-mode' : ''}`}>
          <Title order={2} className="section-title">Our Values</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <List 
                spacing="md"
                size="lg"
                center
                icon={
                  <ThemeIcon color={isDark ? "#EEEEEE" : "#141E61"} radius="xl">
                    <MdCheckCircle size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>Innovation in recruitment technology</List.Item>
                <List.Item>Transparency in all our processes</List.Item>
                <List.Item>User privacy and data security</List.Item>
                <List.Item>Equal opportunity for all job seekers</List.Item>
              </List>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <List 
                spacing="md"
                size="lg"
                center
                icon={
                  <ThemeIcon color={isDark ? "#EEEEEE" : "#141E61"} radius="xl">
                    <MdCheckCircle size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>Continuous improvement of our platform</List.Item>
                <List.Item>Exceptional service to our users</List.Item>
                <List.Item>Building meaningful relationships</List.Item>
                <List.Item>Making recruitment accessible for everyone</List.Item>
              </List>
            </Grid.Col>
          </Grid>
        </section>

        <section className={`team-section ${isDark ? 'dark-mode' : ''}`}>
          <Title order={2} className="section-title">Our Team</Title>
          <Text className="section-text">
            Our diverse team of experts is passionate about creating the best recruitment platform 
            for businesses and job seekers around the world.
          </Text>
          <Space h="md" />
          <Grid>
            {teamMembers.map((member, index) => (
              <Grid.Col span={{ base: 12, xs: 6, md: 3 }} key={index}>
                <Paper className={`team-member-card ${isDark ? 'dark-mode' : ''}`} p="md" radius="md">
                  <Stack align="center">
                    <Avatar 
                      src={member.avatar} 
                      size="xl" 
                      radius="50%" 
                      className="team-avatar"
                    />
                    <div className="team-info">
                      <Text fw={700} className="team-name">{member.name}</Text>
                      <Text size="sm" className="team-position">{member.position}</Text>
                    </div>
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </section>

        <section className={`contact-section ${isDark ? 'dark-mode' : ''}`}>
          <Title order={2} className="section-title">Get In Touch</Title>
          <Text className="section-text">
            We'd love to hear from you! Whether you have questions about our platform, 
            need assistance, or want to provide feedback, our team is here to help.
          </Text>
          <Group className="contact-details">
            <div className="contact-item">
              <Text fw={700}>Email:</Text>
              <Text>contact@recruiteflow.com</Text>
            </div>
            <Divider orientation="vertical" />
            <div className="contact-item">
              <Text fw={700}>Phone:</Text>
              <Text>+1 (555) 123-4567</Text>
            </div>
            <Divider orientation="vertical" />
            <div className="contact-item">
              <Text fw={700}>Address:</Text>
              <Text>123 Recruitment Ave, Tech City, TX 75001</Text>
            </div>
          </Group>
        </section>
      </Container>
    </div>
  );
};

export default About;