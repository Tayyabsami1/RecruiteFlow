import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/JobSeeker/JobsList.scss";
import { useSelector } from "react-redux";

const JobsList = () => {
  const { User } = useSelector((state) => state.User);
  const [JobSeekerId, setJobSeekerId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterBy, setFilterBy] = useState("title"); 
  const [filteredJobs, setFilteredJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/job/all"); 
      setJobs(res.data.jobs);
      setFilteredJobs(res.data.jobs);
      const res1=await axios.get(`/api/jobseeker/getJobSeekerId/${User._id}`);
      setJobSeekerId(res1.data.jobSeekerId);

    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId, isApplied) => {
    try {
      if (isApplied) {
        await axios.put(`/api/job/unapply/${jobId}`, { userId: JobSeekerId });
      } else {
        await axios.put(`/api/job/apply/${jobId}`, { userId: JobSeekerId});
      }
      fetchJobs(); 
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

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
        } else if (filterBy === "location") {
          return job.location.toLowerCase().includes(value.toLowerCase());
        } else {
          return job[filterBy]?.toLowerCase().includes(value.toLowerCase());
        }
      });
      setFilteredJobs(filtered);
    }
  };

  return (
    <div className="jobs-list-container">
      <h1>Available Jobs</h1>

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
        {filteredJobs.map((job) => {
          const isApplied = job.whoApplied?.includes(JobSeekerId);
          return (
            <div className="job-card" key={job._id}>
              <h2>{job.title}</h2>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
              <p><strong>Industry:</strong> {job.industry}</p>
              <p><strong>Skills:</strong> {job.skills.join(", ")}</p>

              <button
                className={isApplied ? "applied-btn" : "apply-btn"}
                onClick={() => handleApply(job._id, isApplied)}
              >
                {isApplied ? "Applied" : "Apply"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobsList;
