import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../Styles/JobSeeker/CompleteProfile.scss';

const CompleteProfile = () => {
    const { User } = useSelector((state) => state.User);
    const [skills, setSkills] = useState([]);
    const [experienceLevel, setExperienceLevel] = useState('');
    const [preferredLocations, setPreferredLocations] = useState([]);
    const [jobInterests, setJobInterests] = useState([]);
    const [resume, setResume] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('skills', JSON.stringify(skills));
        formData.append('experienceLevel', experienceLevel);
        formData.append('preferredLocations', JSON.stringify(preferredLocations));
        formData.append('jobInterests', JSON.stringify(jobInterests));
        formData.append('resume', resume);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}
                /api/jobseeker/complete-profile/${User._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Profile updated successfully!');
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to update profile.');
        }
    };

    return (
        <div className="complete-profile-container">
            <h2>Complete Your Jobseeker Profile</h2>
            <form onSubmit={handleSubmit} className="profile-form">
                <input 
                    type="text" 
                    placeholder="Experience Level" 
                    value={experienceLevel} 
                    onChange={(e) => setExperienceLevel(e.target.value)} 
                />

                <input 
                    type="text" 
                    placeholder="Add Skills (comma separated)" 
                    onBlur={(e) => setSkills(e.target.value.split(','))} 
                />

                <input 
                    type="text" 
                    placeholder="Preferred Locations (comma separated)" 
                    onBlur={(e) => setPreferredLocations(e.target.value.split(','))} 
                />

                <input 
                    type="text" 
                    placeholder="Job Interests (comma separated)" 
                    onBlur={(e) => setJobInterests(e.target.value.split(','))} 
                />

                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setResume(e.target.files[0])} 
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CompleteProfile;
