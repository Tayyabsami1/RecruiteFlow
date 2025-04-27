import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../Styles/JobSeeker/Dashboard.scss";

const Dashboard = () => {
  const { User } = useSelector((state) => state.User);
  const [jobSeekerId, setJobSeekerId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [shortlistedJobs, setShortlistedJobs] = useState([]);
  const [interviewedJobs, setInterviewedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobSeekerId = async () => {
      try {
        const res = await axios.get(`/api/jobseeker/getJobSeekerId/${User._id}`);
        setJobSeekerId(res.data.jobSeekerId);
      } catch (error) {
        console.error("Error fetching job seeker id:", error);
        setLoading(false);
      }
    };

    if (User) {
      fetchJobSeekerId();
    }
  }, [User]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/job/UserDashboard/${jobSeekerId}`
        );
        setAppliedJobs(res.data.appliedJobs);
        setShortlistedJobs(res.data.shortlistedJobs);
        setInterviewedJobs(res.data.interviewedJobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    if (jobSeekerId) {
      fetchDashboardData();
    }
  }, [jobSeekerId]);

  if (loading) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <h2>Applied Jobs</h2>
      <div className="job-list">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
              <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
              <p><strong>Industry:</strong> {job.industry}</p>
            </div>
          ))
        ) : (
          <p>No jobs applied yet.</p>
        )}
      </div>

      <h2>Shortlisted Jobs</h2>
      <div className="job-list">
        {shortlistedJobs.length > 0 ? (
          shortlistedJobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
              <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
              <p><strong>Industry:</strong> {job.industry}</p>
            </div>
          ))
        ) : (
          <p>No jobs shortlisted yet.</p>
        )}
      </div>

      <h2>Interviewed Jobs</h2>
      <div className="job-list">
        {interviewedJobs.length > 0 ? (
          interviewedJobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
              <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
              <p><strong>Industry:</strong> {job.industry}</p>
            </div>
          ))
        ) : (
          <p>No jobs interviewed yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
