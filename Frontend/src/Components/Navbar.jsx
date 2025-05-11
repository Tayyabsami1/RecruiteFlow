import React, {  useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { FiSun, FiMoon } from 'react-icons/fi';
import { AiOutlineUser, AiOutlineMenu } from 'react-icons/ai';
import "../Styles/Navbar.scss";
import axios from 'axios';
import { clearUserData } from '../Features/User/UserSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  // states
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  // location and Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // You can get the user info from Redux store when implemented
  const {User} = useSelector((state) => state.User) || null;

  const handleLogout =async()=>{
    try{
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Auth/logout`, { withCredentials: true });
    dispatch(clearUserData());
    toast.success("User Logout Successful")
    navigate('/');
    }
    catch(err)
    {
      toast.error(err.response.data.msg);
    }
  }

  const pages =User?.userType==='Admin'?[
    {name:'Home', path:'/Admin'},
    {name:'Manage Users', path:'users'},
    {name:'Manage Jobs', path:'jobs'},
    {name:'Comming Soon', path:'/'},

  ]:User?.userType==='Recruiter'?[
    {name:'Home', path:'/'}, // url will be /Recruiter (base path)
    { name: 'About', path: '/about' }, //base path, /Recruiter is not in this path becasue about page is same for every user type, so just /about is the path to render the component About.jsx being handled in App.jsx
    {name: 'Posted Jobs', path: '/Recruiter/postedjobs'},
    {name: 'Post New Job', path: '/Recruiter/post-job'}
  ]:User?.userType=='Jobseeker'? [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' }
  ]:[
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' }
  ];
  
  const userMenu = User ? [
    { name: 'Profile', action: () => navigate('profile') },
    { name: 'Dashboard', action: () => navigate('dashboard') },
    { name: 'Settings', action: () => navigate('settings') },
    { name: 'Logout', action: () => handleLogout() }
  ] : [
    { name: 'Login', action: () => navigate('/login') },
    { name: 'Sign Up', action: () => navigate('/signup') }
  ];

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Check if the current path matches the link path to determine the active state
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    // App Bar the MUI component for the top navigation bar
    <AppBar position="static" className={`navbar ${colorScheme === 'dark' ? 'dark' : ''}`}>
    <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />

      <Container maxWidth="xl">

        <Toolbar disableGutters>
          {/* Logo - Desktop */}

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            className="navbar-logo"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            RecruiteFlow
          </Typography>


          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <AiOutlineMenu />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            className="navbar-logo-mobile"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            RecruiteFlow
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} className="nav-links">
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                className={`nav-link ${isActive(page.path) ? 'active' : ''}`}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Theme Toggle and User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ActionIcon
              onClick={toggleColorScheme}
              variant="outline"
              className="theme-toggle"
              title={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {colorScheme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </ActionIcon>

            <Box sx={{ ml: 2 }}>
              <Tooltip title={User ? "Account settings" : "Login/Register"}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {User ? (
                    <Avatar alt={User.name} src={User.avatar || ''} />
                  ) : (
                    <Avatar>
                      <AiOutlineUser />
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userMenu.map((item) => (
                  <MenuItem key={item.name} onClick={() => {
                    item.action();
                    handleCloseUserMenu();
                  }}>
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;