import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../Styles/JobSeeker/CompleteProfile.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';
import { useMantineColorScheme } from '@mantine/core';

const CompleteProfile = () => {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const { User } = useSelector((state) => state.User);
    const [jobSeekerData, setJobSeekerData] = useState(null);
    let NewResumeCheck=false;
    const [skills, setSkills] = useState([]);
    const [experienceLevel, setExperienceLevel] = useState('');
    const [preferredLocations, setPreferredLocations] = useState([]);
    const [jobInterests, setJobInterests] = useState([]);
    const [resume, setResume] = useState(null);
    const [extractingSkills, setExtractingSkills] = useState(false);
    const [newResumeUploaded, setNewResumeUploaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchJobSeekerData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/jobseeker/get-profile/${User._id}`,{withCredentials:true});
                const data = response.data;

                // Parse fields if they are strings
                setSkills(typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills || []);
                setPreferredLocations(typeof data.preferredLocations === 'string' ? JSON.parse(data.preferredLocations) : data.preferredLocations || []);
                setJobInterests(typeof data.jobInterests === 'string' ? JSON.parse(data.jobInterests) : data.jobInterests || []);
                setExperienceLevel(data.experienceLevel || '');

                setJobSeekerData(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchJobSeekerData();
    }, [User._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('skills', JSON.stringify(skills));
        formData.append('experienceLevel', experienceLevel);
        formData.append('preferredLocations', JSON.stringify(preferredLocations));
        formData.append('jobInterests', JSON.stringify(jobInterests));
        if (resume) 
        {     
            formData.append('resume', resume);
            NewResumeCheck=true;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/jobseeker/update-profile/${User._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials:true
            });
            toast.success("Profile Updated Successfully!");
            setJobSeekerData(response.data); // update UI
            if(NewResumeCheck)
                setNewResumeUploaded(true); // Reset the flag after update
            setResume(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResume(file);
            toast.info("Resume selected. Don't forget to save your changes.");
        }
    };

    const extractSkillsFromResume = async () => {
        // Check if user has uploaded a resume
        if (!resume && (!jobSeekerData || !jobSeekerData.resume)) {
            toast.error("Please upload a resume first to extract skills");
            return;
        }

        setExtractingSkills(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/jobseeker/ai/resume-skills`,
                {withCredentials:true}
            );
            
            const extractedSkills = response.data.data.skills;
            setSkills(extractedSkills);
            toast.success("Skills extracted and updated successfully from your resume!");
            setNewResumeUploaded(false); // Reset flag after extraction
        } catch (error) {
            console.error("Error extracting skills:", error);
            toast.error(error.response?.data?.message || "Failed to extract skills from resume");
        } finally {
            setExtractingSkills(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme={isDark ? "dark" : "light"} />
            <div className={`complete-profile-container ${isDark ? 'dark-mode' : ''}`}>
                <h2>Jobseeker Profile</h2>

                {loading ? (
                    <div className="loading-container">
                        <CircularProgress style={{ color: isDark ? "#EEEEEE" : "#0F044C" }} />
                        <p>Loading profile information...</p>
                    </div>
                ) : (
                    <>
                        <section className="basic-info">
                            <h3>Basic Information</h3>
                            <p><strong>Name:</strong> {User.name}</p>
                            <p><strong>Email:</strong> {User.email}</p>
                            <p><strong>Phone Number:</strong> {User.phone}</p>
                            <p><strong>CNIC:</strong> {User.cnic}</p>
                            <p><strong>User Type:</strong> {User.userType}</p>
                        </section>

                        <section className="special-info">
                            <h3>Technical Information</h3>
                            {jobSeekerData ? (
                                <>
                                    <p><strong>Experience Level:</strong> {jobSeekerData.experienceLevel || 'Not specified'}</p>
                                    <p><strong>Skills:</strong>
                                        {Array.isArray(jobSeekerData.skills) && jobSeekerData.skills.length > 0 
                                            ? jobSeekerData.skills.join(', ') 
                                            : 'No skills added yet'}
                                    </p>
                                    <p><strong>Preferred Locations:</strong>
                                        {Array.isArray(jobSeekerData.preferredLocations) && jobSeekerData.preferredLocations.length > 0
                                            ? jobSeekerData.preferredLocations.join(', ') 
                                            : 'No preferred locations added yet'}
                                    </p>
                                    <p><strong>Job Interests:</strong>
                                        {Array.isArray(jobSeekerData.jobInterests) && jobSeekerData.jobInterests.length > 0
                                            ? jobSeekerData.jobInterests.join(', ') 
                                            : 'No job interests added yet'}
                                    </p>
                                    <p><strong>Resume:</strong>
                                        {jobSeekerData.resume ? (
                                            // TODO Make this URL dynamic before deploying 
                                            <a href={`${jobSeekerData.resume}`} target="_blank" rel="noopener noreferrer">
                                                View Resume
                                            </a>
                                        ) : ' No resume uploaded yet.'}
                                    </p>
                                </>
                            ) : (
                                <p>No technical information available yet. Complete your profile below.</p>
                            )}
                        </section>

                        <section className="update-form">
                            <h3>Update Technical Information</h3>
                            <form onSubmit={handleSubmit} className="profile-form">
                                {jobSeekerData?.resume ? <label>Update Resume (PDF)</label> : <label>Upload Resume (PDF):</label>}
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleResumeUpload}
                                />
                                
                                <div className="skills-section">
                                    <label>Skills (comma separated):</label>
                                    <div className="skills-input-group">
                                        <input
                                            type="text"
                                            placeholder="Skills (comma separated)"
                                            value={skills.join(', ')}
                                            onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()))}
                                        />
                                        {jobSeekerData?.resume && newResumeUploaded && (
                                            <button 
                                                type="button" 
                                                className="extract-skills-btn"
                                                onClick={extractSkillsFromResume}
                                                disabled={true}
                                            >
                                                {extractingSkills ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : "Extract from Resume (This feature is not available yet)"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <label>Experience Level:</label>
                                <input
                                    type="text"
                                    placeholder="Experience Level"
                                    value={experienceLevel}
                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                />

                                <label>Preferred Locations (comma separated):</label>
                                <input
                                    type="text"
                                    placeholder="Preferred Locations (comma separated)"
                                    value={preferredLocations.join(', ')}
                                    onChange={(e) => setPreferredLocations(e.target.value.split(',').map(location => location.trim()))}
                                />

                                <label>Job Interests (comma separated):</label>
                                <input
                                    type="text"
                                    placeholder="Job Interests (comma separated)"
                                    value={jobInterests.join(', ')}
                                    onChange={(e) => setJobInterests(e.target.value.split(',').map(interest => interest.trim()))}
                                />

                                <button type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <CircularProgress size={20} color="inherit" style={{ marginRight: '8px' }} />
                                            Updating...
                                        </>
                                    ) : "Update Profile"}
                                </button>
                            </form>
                        </section>
                    </>
                )}
            </div>
        </>
    );
};

export default CompleteProfile;