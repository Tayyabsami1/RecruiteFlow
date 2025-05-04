import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/JobSeeker/JobsList.scss";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { useMantineColorScheme } from "@mantine/core";

const JobsList = () => {
  const { User } = useSelector((state) => state.User);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [JobSeekerId, setJobSeekerId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterBy, setFilterBy] = useState("title"); 
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setappliedJobs] = useState([]);
  const [isRecommended, setIsRecommended] = useState(false);

  const fetchJobs = async (recommended = false) => {
    try {
      if(JobSeekerId){
        const url = recommended 
          ? `/api/jobseeker/ai/recommended-jobs/${JobSeekerId}`
          : `/api/job/get-jobs/${JobSeekerId}`;
        const res = await axios.get(url);
        // Ensure jobs is always an array, even if empty
        const jobsData = res.data?.jobs || [];
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setIsRecommended(recommended);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
      setFilteredJobs([]);
      toast.error("Error fetching jobs");
    }
  };

  useEffect(()=>{
    const fetchJobSeekerId=async()=>{
      try {
        const res1=await axios.get(`/api/jobseeker/getJobSeekerId/${User._id}`);
        setJobSeekerId(res1.data.jobSeekerId);
      } catch (error) {
        console.error("Error fetching JobSeekerId:", error);
      }
    };

    fetchJobSeekerId();
  },[])

  useEffect(() => {
    fetchJobs();
  }, [JobSeekerId]);

  const toggleJobsView = () => {
    fetchJobs(!isRecommended);
  };

  const handleApply = async (jobId, isApplied) => {
    try {
      if (!isApplied) {
        await axios.put(`/api/job/apply/${jobId}`, { userId: JobSeekerId});
        toast("Applied Successfully!");
        setappliedJobs([...appliedJobs,jobId]);
      }
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
    <div className={`jobs-list-container ${isDark ? 'dark-mode' : ''}`}>
      <ToastContainer />
      <div className="header-container">
        <h1>{isRecommended ? 'Recommended Jobs' : 'Available Jobs'}</h1>
        <button 
          className={`toggle-view-btn ${isDark ? 'dark' : 'light'}`}
          onClick={toggleJobsView}
        >
          {isRecommended ? 'All Jobs' : 'Recommended Jobs'}
        </button>
      </div>

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
          filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id);       
            
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
                  disabled={isApplied}
                >
                  {isApplied ? "Applied" : "Apply"}
                </button>
              </div>
            );
          })
        ) : (
          <div className="no-jobs-message">
            <p>{isRecommended 
              ? "No recommended jobs found. Try updating your skills and preferred locations in your profile." 
              : "No jobs available matching your search criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;