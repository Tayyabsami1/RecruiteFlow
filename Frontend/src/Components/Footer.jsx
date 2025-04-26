import React from 'react';
import { Box, Container, Grid, Group, Text, Title, Anchor, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { AiOutlineTwitter, AiOutlineYoutube, AiOutlineInstagram, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';
import '../Styles/Footer.scss';

const Footer = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const linkGroups = [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Help Center', href: '/help' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
    {
      title: 'For Employers',
      links: [
        { label: 'Post a Job', href: '/post-job' },
        { label: 'Find Candidates', href: '/find-candidates' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Enterprise', href: '/enterprise' },
      ],
    },
  ];

  return (
    <Box component="footer" className={`footer ${isDark ? 'footer-dark' : 'footer-light'}`}>
      <Container size="lg" className='footer-container'>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }} className="footer-brand">
            <Title order={3} className="footer-logo">RecruiteFlow</Title>
            <Text className="footer-description">
              Connecting talent with opportunity. Your next career move starts here.
            </Text>
            <Group className="footer-social">
              <ActionIcon size="lg" variant="subtle" radius="xl">
                <AiOutlineTwitter size={20} />
              </ActionIcon>
              <ActionIcon size="lg" variant="subtle" radius="xl">
                <AiOutlineYoutube size={20} />
              </ActionIcon>
              <ActionIcon size="lg" variant="subtle" radius="xl">
                <AiOutlineInstagram size={20} />
              </ActionIcon>
            </Group>
          </Grid.Col>

          {linkGroups.map((group) => (
            <Grid.Col key={group.title} span={{ base: 6, md: 2 }} className="footer-links">
              <Title order={5} className="footer-links-title">{group.title}</Title>
              {group.links.map((link) => (
                <Anchor key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </Anchor>
              ))}
            </Grid.Col>
          ))}

          <Grid.Col span={{ base: 12, md: 2 }} className="footer-contact">
            <Title order={5} className="footer-links-title">Contact</Title>
            <Group className="footer-contact-item">
              <AiOutlineMail size={16} />
              <Text>info@recruiteflow.com</Text>
            </Group>
            <Group className="footer-contact-item">
              <AiOutlinePhone size={16} />
              <Text>+1 (555) 123-4567</Text>
            </Group>
            <Group className="footer-contact-item">
              <GoLocation size={16} />
              <Text>New York, NY</Text>
            </Group>
          </Grid.Col>
        </Grid>

        <Box className="footer-bottom">
          <Text className="footer-copyright">
            © {new Date().getFullYear()} RecruiteFlow. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;