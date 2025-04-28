import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../Styles/JobSeeker/CompleteProfile.scss';
import { ToastContainer, toast } from 'react-toastify';

const CompleteProfile = () => {
    const { User } = useSelector((state) => state.User);
    const [jobSeekerData, setJobSeekerData] = useState(null);

    const [skills, setSkills] = useState([]);
    const [experienceLevel, setExperienceLevel] = useState('');
    const [preferredLocations, setPreferredLocations] = useState([]);
    const [jobInterests, setJobInterests] = useState([]);
    const [resume, setResume] = useState(null);

    useEffect(() => {
        const fetchJobSeekerData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/jobseeker/get-profile/${User._id}`);
                const data = response.data;

                // Parse fields if they are strings
                setSkills(typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills || []);
                setPreferredLocations(typeof data.preferredLocations === 'string' ? JSON.parse(data.preferredLocations) : data.preferredLocations || []);
                setJobInterests(typeof data.jobInterests === 'string' ? JSON.parse(data.jobInterests) : data.jobInterests || []);
                setExperienceLevel(data.experienceLevel || '');

                setJobSeekerData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchJobSeekerData();
    }, [User._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('skills', JSON.stringify(skills));
        formData.append('experienceLevel', experienceLevel);
        formData.append('preferredLocations', JSON.stringify(preferredLocations));
        formData.append('jobInterests', JSON.stringify(jobInterests));
        if (resume) formData.append('resume', resume);

        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/jobseeker/update-profile/${User._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast("Profile Updated Successfully!");
            setJobSeekerData(response.data); // update UI
        } catch (error) {
            console.error(error);
            alert('Failed to update profile.');
        }
    };

    return (
    <>

        <ToastContainer />
        <div className="complete-profile-container">
            <h2>Jobseeker Profile</h2>
           

            <section className="basic-info">
                <h3>Basic Information</h3>
                <p><strong>Name:</strong> {User.name}</p>
                <p><strong>Email:</strong> {User.email}</p>
                <p><strong>Phone Number:</strong> {User.phone}</p>
                <p><strong>CNIC:</strong> {User.cnic}</p>
                <p><strong>User Type:</strong> {User.userType}</p>
            </section>

            <section className="special-info">
                <h3>Special Information</h3>
                {jobSeekerData ? (
                    <>
                        <p><strong>Experience Level:</strong> {jobSeekerData.experienceLevel}</p>
                        <p><strong>Skills:</strong> 
                            {Array.isArray(jobSeekerData.skills) ? jobSeekerData.skills.join(', ') : ''}
                        </p>
                        <p><strong>Preferred Locations:</strong> 
                            {Array.isArray(jobSeekerData.preferredLocations) ? jobSeekerData.preferredLocations.join(', ') : ''}
                        </p>
                        <p><strong>Job Interests:</strong> 
                            {Array.isArray(jobSeekerData.jobInterests) ? jobSeekerData.jobInterests.join(', ') : ''}
                        </p>
                        <p><strong>Resume:</strong> 
                            {jobSeekerData.resume ? (
                                <a href={`${import.meta.env.VITE_BACKEND_URL}/${jobSeekerData.resume}`} target="_blank" rel="noopener noreferrer">
                                    View Resume
                                </a>
                            ) : ' No resume uploaded.'}
                        </p>
                    </>
                ) : (
                    <p>Loading special information...</p>
                )}
            </section>

            <section className="update-form">
                <h3>Update Special Information</h3>
                <form onSubmit={handleSubmit} className="profile-form">
                    <label>Experience Level:</label>
                    <input 
                        type="text" 
                        placeholder="Experience Level" 
                        value={experienceLevel} 
                        onChange={(e) => setExperienceLevel(e.target.value)} 
                    />

                    <label>Skills (comma separated):</label>
                    <input 
                        type="text" 
                        placeholder="Skills (comma separated)" 
                        value={skills.join(', ')}
                        onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()))} 
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

                    <label>Upload Resume (PDF):</label>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => setResume(e.target.files[0])} 
                    />

                    <button type="submit">Update Profile</button>
                </form>
            </section>
        </div>
        </>);
};

export default CompleteProfile;
