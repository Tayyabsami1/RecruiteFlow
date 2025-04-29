import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/Recruiter/PostedJobs.scss";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const PostedJobs = () => {
  const { User } = useSelector((state) => state.User);
  const [recruiterId, setRecruiterId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Fetch the recruiter ID using the user ID
  useEffect(() => {
    const fetchRecruiterId = async () => {
      try {
        const res = await axios.get(`/api/recruiter/getRecruiterId/${User._id}`);
        //console.log("Fetched Recruiter ID:", res.data.recruiterId);
        setRecruiterId(res.data.recruiterId);
      } catch (error) {
        console.error("Error fetching RecruiterId:", error);
      }
    };

    if (User?._id) {
      fetchRecruiterId();
    }
  }, [User]);

  // Fetch jobs once recruiter ID is available
  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const res = await axios.get(`/api/job/get-posted-jobs/${recruiterId}`);
        console.log("Fetched Jobs:", res.data.jobs);
        setJobs(res.data.jobs);
        setFilteredJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching recruiter jobs:", error);
      }
    };

    if (recruiterId) {
      fetchPostedJobs();
    }
  }, [recruiterId]);

  // Search/filter jobs
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

  return (
    <div className="jobs-list-container">
      <ToastContainer />
      <h1>My Posted Jobs</h1>

      <div className="search-filter">
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="filter-dropdown"
        >
          <option value="title">Title</option>
          <option value="location">Location</option>
          <option value="experienceLevel">Experience Level</option>
          <option value="skills">Skills</option>
          <option value="industry">Industry</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${filterBy}`}
          value={searchText}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h2>{job.title}</h2>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
              <p><strong>Industry:</strong> {job.industry}</p>
              <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
              <p><strong>Applicants:</strong> {job.whoApplied?.length || 0}</p>
            </div>
          ))
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostedJobs;
