import React, { useState, useEffect } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';

import { CloseFullscreen, Search as SearchIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';

import '../../Styles/Admin/ManageUsers.scss';

import { useMantineColorScheme } from '@mantine/core';

import axios from "axios"

const ManageUsers = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  // State variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    userType: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Admin/users`,{withCredentials:true});
          setUsers(response.data.data.users);
          setIsLoading(false);
      } catch (err) {
        console.log(err)
        setError('Failed to load users. Please try again.');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and filter criteria
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setUserTypeFilter(event.target.value);
    setPage(0);
  };

  // Handle edit user
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      userType: user.userType
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      // In a real implementation, replace with actual API call
      // await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${currentUser.id}`, editFormData);
      
      // Update local state for demonstration
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? { ...user, ...editFormData } : user
      );
      setUsers(updatedUsers);
      setEditDialogOpen(false);
      
      // Show success message (implement toast notification in real app)
      console.log('User updated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
      // Show error message (implement toast notification in real app)
    }
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      // In a real implementation, replace with actual API call
      // await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${currentUser.id}`);
      
      // Update local state for demonstration
      const updatedUsers = users.filter(user => user.id !== currentUser.id);
      setUsers(updatedUsers);
      setDeleteDialogOpen(false);
      
      // Show success message (implement toast notification in real app)
      console.log('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      // Show error message (implement toast notification in real app)
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography variant="h6" className="loading-text">Loading users...</Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box className="error-container">
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div className={`manage-users-container ${isDark ? 'dark' : ''}`}>
      
      <Typography variant="h4" component="h1" className="page-title">
        Manage Users
      </Typography>
      
      {/* Search filter Code  */}
      <Paper className="search-filter-container">
        <Box className="search-box">

          <TextField
            variant="outlined"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon className="search-icon" />,
            }}
            className="search-input"
          />
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            onClick={() => setOpenFilterDialog(true)}
            className="filter-button"
          >
            Filter
          </Button>
        </Box>
        
        <Box className="filter-chips">
          {userTypeFilter !== 'all' && (
            <Chip 
              label={`Type: ${userTypeFilter}`} 
              onDelete={() => setUserTypeFilter('all')}
              className="filter-chip"
            />
          )}
        </Box>

      </Paper>
      {/* Search filter Code End  */}
        
      {/* Main Table Code  */}
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.userType} 
                      color={
                        user.userType === 'Admin' ? 'secondary' : 
                        user.userType === 'Recruiter' ? 'primary' : 
                        'default'
                      }
                      variant={isDark ? 'outlined' : 'filled'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right" className="action-buttons">
                    <Tooltip title="Edit user">
                      <IconButton 
                        aria-label="edit" 
                        onClick={() => handleEditClick(user)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete user">
                      <IconButton 
                        aria-label="delete" 
                        onClick={() => handleDeleteClick(user)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" className="no-data-message">
                    No users found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/*Main Table Code End   */}
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="pagination"
      />
      
      {/* Filter Dialog */}
      <Dialog 
        open={openFilterDialog} 
        onClose={() => setOpenFilterDialog(false)}
        aria-labelledby="filter-dialog-title"
      >
        <DialogTitle id="filter-dialog-title">Filter Users</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-type-filter-label">User Type</InputLabel>
            <Select
              labelId="user-type-filter-label"
              id="user-type-filter"
              value={userTypeFilter}
              label="User Type"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Recruiter">Recruiter</MenuItem>
              <MenuItem value="Jobseeker">Job Seeker</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilterDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setUserTypeFilter('all');
              setOpenFilterDialog(false);
            }}
            color="secondary"
          >
            Reset
          </Button>
          <Button 
            onClick={() => setOpenFilterDialog(false)} 
            variant="contained" 
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditDialogClose}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={editFormData.name}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={editFormData.email}
            onChange={handleEditInputChange}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-user-type-label">User Type</InputLabel>
            <Select
              labelId="edit-user-type-label"
              name="userType"
              value={editFormData.userType}
              label="User Type"
              onChange={handleEditInputChange}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Recruiter">Recruiter</MenuItem>
              <MenuItem value="Jobseeker">Job Seeker</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the user "{currentUser?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageUsers;