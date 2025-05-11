import React, { useState, useEffect, useMemo, useCallback } from 'react';

// UI Imports 
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
  Tooltip,
  Autocomplete
} from '@mui/material';

import { Search as SearchIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';

import '../../../node_modules/react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useMantineColorScheme } from '@mantine/core';
import "../../Styles/Admin/ManageJobs.scss"
import axios from "axios";

const ManageJobs = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search and filter states 
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  // Data states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);

  // Edit and Delete dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  const [editFormData, setEditFormData] = useState({
    title: '',
    location: '',
    experienceLevel: '',
    skills: [],
    industry: '',
    status: ''
  });

  // Industry and experience level options
  const industryOptions = ['Information Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Marketing'];
  const experienceLevelOptions = ['Entry Level', 'Mid Level', 'Senior Level'];

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Admin/Jobs`, {withCredentials: true});
        setJobs(response.data.data.jobs);
        setIsLoading(false);
      } catch (err) {
        console.log(err.response?.data?.msg || err.message);
        setError('Failed to load jobs. Please try again.');
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search and filter criteria using useMemo for performance optimization
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry = industryFilter === 'all' || job.industry === industryFilter;
      const matchesExperience = experienceLevelFilter === 'all' || job.experienceLevel === experienceLevelFilter;
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesIndustry && matchesExperience && matchesStatus;
    });
  }, [jobs, searchTerm, industryFilter, experienceLevelFilter, statusFilter]);

  // Handle pagination with useCallback
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Handle search with useCallback
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  // Handle filter changes with useCallback
  const handleIndustryFilterChange = useCallback((event) => {
    setIndustryFilter(event.target.value);
    setPage(0);
  }, []);

  const handleExperienceLevelFilterChange = useCallback((event) => {
    setExperienceLevelFilter(event.target.value);
    setPage(0);
  }, []);

  const handleStatusFilterChange = useCallback((event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  }, []);

  // Handle edit job with useCallback
  const handleEditClick = useCallback((job) => {
    setCurrentJob(job);
    setEditFormData({
      title: job.title,
      location: job.location,
      experienceLevel: job.experienceLevel,
      skills: job.skills,
      industry: job.industry,
      status: job.status
    });
    setEditDialogOpen(true);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false);
  }, []);

  const handleEditInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSkillsChange = useCallback((event, newValue) => {
    setEditFormData(prev => ({
      ...prev,
      skills: newValue
    }));
  }, []);

  // Handle edit form submission with useCallback
  const handleEditSubmit = useCallback(async () => {
    try {
      const requestData = {
        ...editFormData,
        jobId: currentJob._id
      };
      // Use admin route for updating jobs
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/Admin/Jobs/updatejob`, 
        requestData,
        { withCredentials: true }
      );
      
      // Update the local state with the edited job
      const updatedJobs = jobs.map(job => 
        job._id === currentJob._id ? { ...job, ...editFormData } : job
      );
      setJobs(updatedJobs);
      setEditDialogOpen(false);
      
      // Show success message
      toast.success('Job updated successfully');
    } catch (err) {
      console.log(err.response?.data?.msg || err.message);
      toast.error('Failed to update job');
    }
  }, [editFormData, currentJob, jobs]);

  // Handle delete job with useCallback
  const handleDeleteClick = useCallback((job) => {
    setCurrentJob(job);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  // Handle delete confirmation with useCallback
  const handleDeleteConfirm = useCallback(async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/Admin/Jobs/deletejob`, {
        withCredentials: true,
        data:{jobId: currentJob._id}
      });
      
      const updatedJobs = jobs.filter(job => job._id !== currentJob._id);
      setJobs(updatedJobs);
      setDeleteDialogOpen(false);
      
      toast.success('Job deleted successfully');
    } catch (err) {
      console.error('Error deleting job:', err.response?.data?.msg || err.message);
      toast.error('Failed to delete job');
    }
  }, [currentJob, jobs]);

  // Format date with useCallback
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography variant="h6" className="loading-text">Loading jobs...</Typography>
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
    <div className={`manage-jobs-container ${isDark ? 'dark' : ''}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Typography variant="h4" component="h1" className="page-title">
        Manage Jobs
      </Typography>
      
      {/* Search and filter section */}
      <Paper className="search-filter-container">
        <Box className="search-box">
          <TextField
            variant="outlined"
            placeholder="Search jobs..."
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
          {industryFilter !== 'all' && (
            <Chip 
              label={`Industry: ${industryFilter}`} 
              onDelete={() => setIndustryFilter('all')}
              className="filter-chip"
            />
          )}
          {experienceLevelFilter !== 'all' && (
            <Chip 
              label={`Experience: ${experienceLevelFilter}`} 
              onDelete={() => setExperienceLevelFilter('all')}
              className="filter-chip"
            />
          )}
          {statusFilter !== 'all' && (
            <Chip 
              label={`Status: ${statusFilter}`} 
              onDelete={() => setStatusFilter('all')}
              className="filter-chip"
            />
          )}
        </Box>
      </Paper>
      
      {/* Jobs table */}
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader aria-label="jobs table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Experience Level</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Posted By</TableCell>
              <TableCell>Applicants</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredJobs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((job) => (
                <TableRow key={job._id} hover>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.industry}</TableCell>
                  <TableCell>{job.experienceLevel}</TableCell>
                  <TableCell>
                    {job.skills.map((skill, index) => (
                      <Chip 
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                        className="skill-chip"
                        style={{ margin: '2px' }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {job.whoPosted?.user?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {job.whoApplied?.length || 0}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={job.status} 
                      color={job.status === 'open' ? 'success' : 'default'}
                      variant={isDark ? 'outlined' : 'filled'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(job.createdAt)}</TableCell>
                  <TableCell align="right" className="action-buttons">
                    <Tooltip title="Edit job">
                      <IconButton 
                        aria-label="edit" 
                        onClick={() => handleEditClick(job)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete job">
                      <IconButton 
                        aria-label="delete" 
                        onClick={() => handleDeleteClick(job)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

            {filteredJobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body1" className="no-data-message">
                    No jobs found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredJobs.length}
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
        <DialogTitle id="filter-dialog-title">Filter Jobs</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="industry-filter-label">Industry</InputLabel>
            <Select
              labelId="industry-filter-label"
              id="industry-filter"
              value={industryFilter}
              label="Industry"
              onChange={handleIndustryFilterChange}
            >
              <MenuItem value="all">All Industries</MenuItem>
              {industryOptions.map((industry) => (
                <MenuItem key={industry} value={industry}>{industry}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="experience-filter-label">Experience Level</InputLabel>
            <Select
              labelId="experience-filter-label"
              id="experience-filter"
              value={experienceLevelFilter}
              label="Experience Level"
              onChange={handleExperienceLevelFilterChange}
            >
              <MenuItem value="all">All Experience Levels</MenuItem>
              {experienceLevelOptions.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilterDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setIndustryFilter('all');
              setExperienceLevelFilter('all');
              setStatusFilter('all');
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
      
      {/* Edit Job Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditDialogClose}
        aria-labelledby="edit-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">Edit Job</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Job Title"
            type="text"
            fullWidth
            value={editFormData.title}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={editFormData.location}
            onChange={handleEditInputChange}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-industry-label">Industry</InputLabel>
            <Select
              labelId="edit-industry-label"
              name="industry"
              value={editFormData.industry}
              label="Industry"
              onChange={handleEditInputChange}
            >
              {industryOptions.map((industry) => (
                <MenuItem key={industry} value={industry}>{industry}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-experience-label">Experience Level</InputLabel>
            <Select
              labelId="edit-experience-label"
              name="experienceLevel"
              value={editFormData.experienceLevel}
              label="Experience Level"
              onChange={handleEditInputChange}
            >
              {experienceLevelOptions.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-status-label">Status</InputLabel>
            <Select
              labelId="edit-status-label"
              name="status"
              value={editFormData.status}
              label="Status"
              onChange={handleEditInputChange}
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          
          <Autocomplete
            multiple
            id="skills-tags"
            options={[]}
            freeSolo
            value={editFormData.skills}
            onChange={handleSkillsChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Skills"
                placeholder="Add skills"
                margin="dense"
                fullWidth
              />
            )}
          />
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
            Are you sure you want to delete the job "{currentJob?.title}"? This action cannot be undone.
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

export default ManageJobs;