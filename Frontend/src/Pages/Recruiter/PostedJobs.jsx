import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/Recruiter/PostedJobs.scss";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useMantineColorScheme } from "@mantine/core";
import { 
  CircularProgress, 
  Box, 
  Typography, 
  Container, 
  TextField, 
  MenuItem, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  Divider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tooltip
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  People as PeopleIcon,
  LocationOn, 
  WorkOutline, 
  Business, 
  Code
} from "@mui/icons-material";

const PostedJobs = () => {
  const { User } = useSelector((state) => state.User);
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [recruiterId, setRecruiterId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [editFormData, setEditFormData] = useState({
    location: "",
    experienceLevel: "",
    skills: "",
    industry: ""
  });
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const fetchRecruiterId = async () => {
      try {
        const res = await axios.get(`/api/recruiter/getRecruiterId/${User._id}`);
        setRecruiterId(res.data.recruiterId);
      } catch (error) {
        console.error("Error fetching RecruiterId:", error);
        toast.error("Failed to load recruiter profile");
        setLoading(false);
      }
    };

    if (User?._id) fetchRecruiterId();
  }, [User]);

  useEffect(() => {
    const fetchPostedJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/job/get-posted-jobs/${recruiterId}`);
        setJobs(res.data.jobs);
        setFilteredJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching recruiter jobs:", error);
        toast.error("Failed to load posted jobs");
      } finally {
        setLoading(false);
      }
    };

    if (recruiterId) fetchPostedJobs();
  }, [recruiterId]);

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
        } else {
          return job[filterBy]?.toLowerCase().includes(value.toLowerCase());
        }
      });
      setFilteredJobs(filtered);
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/job/deletejob/${jobToDelete._id}`);
      const updated = jobs.filter((job) => job._id !== jobToDelete._id);
      setJobs(updated);
      setFilteredJobs(updated);
      toast.success("Job deleted successfully.");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job.");
    } finally {
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  const handleEditClick = (job) => {
    setCurrentJob(job);
    setEditFormData({
      location: job.location,
      experienceLevel: job.experienceLevel,
      skills: job.skills.join(", "),
      industry: job.industry,
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setCurrentJob(null);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedJob = {
        location: editFormData.location,
        experienceLevel: editFormData.experienceLevel,
        skills: editFormData.skills.split(",").map((s) => s.trim()),
        industry: editFormData.industry,
      };

      await axios.put(`/api/job/updatejob/${currentJob._id}`, updatedJob);

      const updatedJobs = jobs.map((job) =>
        job._id === currentJob._id ? { ...job, ...updatedJob } : job
      );

      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      setEditDialogOpen(false);
      setCurrentJob(null);
      toast.success("Job updated successfully.");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job.");
    }
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/Recruiter/job/${jobId}/applicants`);
  };

  return (
    // Main Box
    <Box className={`posted-jobs-container ${isDark ? 'dark-mode' : ''}`} 
      sx={{ 
        px: { xs: 2, md: 4 },
        py: 3,
        width: '100%',
        maxWidth: '100%',
        bgcolor: isDark ? '#0A0A29' : '#F8F9FA',
        minHeight: 'calc(100vh - 64px)'
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Typography box for text */}
      <Box sx={{ 
        mb: 4, 
        mt: 2,
        textAlign: 'left',
        pl: { xs: 0, md: 2 }
      }}>
        <Typography 
          variant="h4" 
          component="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: isDark ? 'white' : '#0F044C',
            mb: 1
          }}
        >
          My Posted Jobs
        </Typography>
        <Typography 
          variant="body1"
          sx={{ 
            color: isDark ? '#787A91' : '#141E61',
          }}
        >
          Manage and monitor all jobs you've posted
        </Typography>
      </Box>
      {/* Typography box for text end */}
      
      {/* Search Section or Filtering */}
      <Paper elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4,
          mx: { xs: 0, md: 2 },
          bgcolor: isDark ? '#0F044C' : '#FFFFFF',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '8px',
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
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
              bgcolor: isDark ? 'rgba(15, 4, 76, 0.4)' : 'rgba(238, 238, 238, 0.4)'
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
              bgcolor: isDark ? 'rgba(15, 4, 76, 0.4)' : 'rgba(238, 238, 238, 0.4)'
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
        <Grid container spacing={3} className="jobs-grid" sx={{ px: { xs: 0, md: 2 } }}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} lg={4} key={job._id}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: isDark ? '#141E61' : '#FFFFFF',
                    borderRadius: '12px',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    border: isDark ? '1px solid rgba(120, 122, 145, 0.2)' : 'none',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDark ? '0 12px 20px rgba(0, 0, 0, 0.4)' : '0 12px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom 
                      sx={{ 
                        color: isDark ? '#EEEEEE' : '#0F044C',
                        fontWeight: 'bold',
                        mb: 2,
                        borderBottom: isDark ? '2px solid #0F044C' : '2px solid #141E61',
                        pb: 1
                      }}
                    >
                      {job.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <LocationOn sx={{ color: isDark ? '#EEEEEE' : '#141E61', mr: 1 }} />
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
                      <WorkOutline sx={{ color: isDark ? '#EEEEEE' : '#141E61', mr: 1 }} />
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
                      <Business sx={{ color: isDark ? '#EEEEEE' : '#141E61', mr: 1 }} />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: isDark ? '#EEEEEE' : '#141E61'
                        }}
                      >
                        {job.industry}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2, bgcolor: isDark ? 'rgba(120, 122, 145, 0.3)' : 'rgba(15, 4, 76, 0.1)' }} />
                    
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Code sx={{ color: isDark ? '#EEEEEE' : '#141E61', mr: 1 }} />
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
                              bgcolor: isDark ? '#0F044C' : '#141E61',
                              color: '#EEEEEE',
                              fontWeight: 'medium',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mt: 2,
                      p: 1,
                      borderRadius: '8px',
                      bgcolor: isDark ? 'rgba(15, 4, 76, 0.5)' : 'rgba(15, 4, 76, 0.05)',
                    }}>
                      <PeopleIcon sx={{ color: isDark ? '#EEEEEE' : '#141E61', mr: 1 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isDark ? '#EEEEEE' : '#141E61'
                        }}
                      >
                        <strong>Applicants:</strong> {job.whoApplied?.length || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 3, justifyContent: 'space-between', bgcolor: isDark ? 'rgba(15, 4, 76, 0.3)' : 'rgba(15, 4, 76, 0.03)' }}>
                    <Box>
                      <Tooltip title="Edit job">
                        <IconButton 
                          onClick={() => handleEditClick(job)} 
                          size="small"
                          sx={{ 
                            color: isDark ? '#EEEEEE' : '#0F044C',
                            mr: 1,
                            bgcolor: isDark ? 'rgba(15, 4, 76, 0.3)' : 'rgba(238, 238, 238, 0.5)'
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete job">
                        <IconButton 
                          onClick={() => handleDeleteClick(job)} 
                          size="small"
                          sx={{ 
                            color: isDark ? '#EEEEEE' : '#0F044C',
                            bgcolor: isDark ? 'rgba(15, 4, 76, 0.3)' : 'rgba(238, 238, 238, 0.5)'
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() => handleViewApplicants(job._id)}
                      sx={{
                        bgcolor: isDark ? '#0F044C' : '#141E61',
                        color: '#EEEEEE',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        '&:hover': {
                          bgcolor: isDark ? '#141E61' : '#0F044C',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      View Applicants
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper 
                elevation={2} 
                sx={{ 
                  textAlign: 'center',
                  p: 4,
                  mx: { xs: 0, md: 2 },
                  bgcolor: isDark ? '#141E61' : '#FFFFFF',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(120, 122, 145, 0.2)' : 'none',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDark ? '#EEEEEE' : '#0F044C',
                    fontWeight: 'medium'
                  }}
                >
                  No jobs posted yet. Create your first job listing to get started!
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: isDark ? '#0F044C' : '#141E61',
                    color: '#EEEEEE',
                    fontWeight: 'bold',
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: isDark ? '#141E61' : '#0F044C',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/Recruiter/post-job')}
                >
                  Post a Job
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Edit Job Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDark ? '#0F044C' : '#FFFFFF',
            color: isDark ? '#EEEEEE' : '#0F044C',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: isDark ? '1px solid rgba(238, 238, 238, 0.1)' : '1px solid rgba(15, 4, 76, 0.1)', pb: 2 }}>
          Edit Job: {currentJob?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={editFormData.location}
            onChange={handleEditChange}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                color: isDark ? '#EEEEEE' : '#0F044C',
                "& fieldset": { borderColor: isDark ? '#787A91' : '#141E61' },
                "&:hover fieldset": { borderColor: isDark ? '#EEEEEE' : '#0F044C' },
                bgcolor: isDark ? 'rgba(20, 30, 97, 0.3)' : 'rgba(238, 238, 238, 0.3)'
              },
              "& .MuiInputLabel-root": {
                color: isDark ? '#EEEEEE' : '#0F044C'
              }
            }}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-experience-label" sx={{ color: isDark ? '#EEEEEE' : '#0F044C' }}>
              Experience Level
            </InputLabel>
            <Select
              labelId="edit-experience-label"
              name="experienceLevel"
              value={editFormData.experienceLevel}
              label="Experience Level"
              onChange={handleEditChange}
              sx={{
                color: isDark ? '#EEEEEE' : '#0F044C',
                "& .MuiOutlinedInput-notchedOutline": { 
                  borderColor: isDark ? '#787A91' : '#141E61' 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": { 
                  borderColor: isDark ? '#EEEEEE' : '#0F044C' 
                },
                "& .MuiSvgIcon-root": { 
                  color: isDark ? '#EEEEEE' : '#0F044C' 
                },
                bgcolor: isDark ? 'rgba(20, 30, 97, 0.3)' : 'rgba(238, 238, 238, 0.3)'
              }}
            >
              <MenuItem value="Entry Level">Entry Level</MenuItem>
              <MenuItem value="Mid Level">Mid Level</MenuItem>
              <MenuItem value="Senior Level">Senior Level</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="edit-industry-label" sx={{ color: isDark ? '#EEEEEE' : '#0F044C' }}>
              Industry
            </InputLabel>
            <Select
              labelId="edit-industry-label"
              name="industry"
              value={editFormData.industry}
              label="Industry"
              onChange={handleEditChange}
              sx={{
                color: isDark ? '#EEEEEE' : '#0F044C',
                "& .MuiOutlinedInput-notchedOutline": { 
                  borderColor: isDark ? '#787A91' : '#141E61' 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": { 
                  borderColor: isDark ? '#EEEEEE' : '#0F044C' 
                },
                "& .MuiSvgIcon-root": { 
                  color: isDark ? '#EEEEEE' : '#0F044C' 
                },
                bgcolor: isDark ? 'rgba(20, 30, 97, 0.3)' : 'rgba(238, 238, 238, 0.3)'
              }}
            >
              <MenuItem value="Information Technology">Information Technology</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Manufacturing">Manufacturing</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="skills"
            label="Skills (comma separated)"
            type="text"
            fullWidth
            value={editFormData.skills}
            onChange={handleEditChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: isDark ? '#EEEEEE' : '#0F044C',
                "& fieldset": { borderColor: isDark ? '#787A91' : '#141E61' },
                "&:hover fieldset": { borderColor: isDark ? '#EEEEEE' : '#0F044C' },
                bgcolor: isDark ? 'rgba(20, 30, 97, 0.3)' : 'rgba(238, 238, 238, 0.3)'
              },
              "& .MuiInputLabel-root": {
                color: isDark ? '#EEEEEE' : '#0F044C'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: isDark ? '1px solid rgba(238, 238, 238, 0.1)' : '1px solid rgba(15, 4, 76, 0.1)' }}>
          <Button 
            onClick={handleEditCancel}
            variant="outlined"
            sx={{ 
              color: isDark ? '#EEEEEE' : '#0F044C',
              borderColor: isDark ? '#EEEEEE' : '#0F044C',
              '&:hover': {
                borderColor: isDark ? '#EEEEEE' : '#0F044C',
                bgcolor: isDark ? 'rgba(238, 238, 238, 0.05)' : 'rgba(15, 4, 76, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            sx={{
              bgcolor: isDark ? '#0F044C' : '#141E61',
              color: '#EEEEEE',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: isDark ? '#141E61' : '#0F044C',
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            bgcolor: isDark ? '#0F044C' : '#FFFFFF',
            color: isDark ? '#EEEEEE' : '#0F044C',
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the job "{jobToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ 
              color: isDark ? '#EEEEEE' : '#0F044C',
              borderColor: isDark ? '#EEEEEE' : '#0F044C',
              '&:hover': {
                borderColor: isDark ? '#EEEEEE' : '#0F044C',
                bgcolor: isDark ? 'rgba(238, 238, 238, 0.05)' : 'rgba(15, 4, 76, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            sx={{
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(211, 47, 47, 0.3)'
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostedJobs;
