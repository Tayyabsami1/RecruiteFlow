import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/Recruiter/PostedJobs.scss";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import AllApplicants from "./AllApplicants";

const PostedJobs = () => {
  const { User } = useSelector((state) => state.User);
  const [recruiterId, setRecruiterId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  const [editJobId, setEditJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showApplicants, setShowApplicants] = useState(null);
  const [applicants, setApplicants] = useState(null);

  useEffect(() => {
    const fetchRecruiterId = async () => {
      try {
        const res = await axios.get(`/api/recruiter/getRecruiterId/${User._id}`);
        setRecruiterId(res.data.recruiterId);
      } catch (error) {
        console.error("Error fetching RecruiterId:", error);
      }
    };

    if (User?._id) fetchRecruiterId();
  }, [User]);

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const res = await axios.get(`/api/job/get-posted-jobs/${recruiterId}`);
        setJobs(res.data.jobs);
        console.log(res.data.jobs)
        setFilteredJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching recruiter jobs:", error);
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/job/deletejob/${id}`);
      const updated = jobs.filter((job) => job._id !== id);
      setJobs(updated);
      setFilteredJobs(updated);
      toast.success("Job deleted successfully.");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job.");
    }
  };

  const handleEditClick = (job) => {
    setEditJobId(job._id);
    setEditFormData({
      location: job.location,
      experienceLevel: job.experienceLevel,
      skills: job.skills.join(", "),
      industry: job.industry,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (jobId) => {
    try {
      const updatedJob = {
        location: editFormData.location,
        experienceLevel: editFormData.experienceLevel,
        skills: editFormData.skills.split(",").map((s) => s.trim()),
        industry: editFormData.industry,
      };

      await axios.put(`/api/job/updatejob/${jobId}`, updatedJob);

      const updatedJobs = jobs.map((job) =>
        job._id === jobId ? { ...job, ...updatedJob } : job
      );

      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      setEditJobId(null);
      toast.success("Job updated successfully.");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job.");
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const res = await axios.get(`/api/job/applicants/${jobId}`);
      setApplicants({
        jobId,
        applied: res.data.applied,
        shortlisted: res.data.shortlisted,
        interviewed: res.data.interviewed,
      });
      setShowApplicants(jobId);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to load applicants");
    }
  };

  return (
    <div className="jobs-list-container">
      <ToastContainer />

      {!showApplicants && (
        <>
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
        </>
      )}

      {showApplicants && applicants ? (
        <AllApplicants
          applicants={applicants}
          jobId={applicants.jobId}
          onBack={() => setShowApplicants(null)}
          refreshApplicants={() => fetchApplicants(applicants.jobId)} 
        />
      ) : (
        <div className="jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="job-card" key={job._id}>
                <h2>{job.title}</h2>
                {editJobId === job._id ? (
                  <>
                    <input name="location" value={editFormData.location} onChange={handleEditChange} />
                    <input name="experienceLevel" value={editFormData.experienceLevel} onChange={handleEditChange} />
                    <input name="industry" value={editFormData.industry} onChange={handleEditChange} />
                    <input name="skills" value={editFormData.skills} onChange={handleEditChange} />
                    <button onClick={() => handleSaveEdit(job._id)}>Save</button>
                  </>
                ) : (
                  <>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
                    <p><strong>Industry:</strong> {job.industry}</p>
                    <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
                    <p><strong>Applicants:</strong> {job.whoApplied?.length || 0}</p>
                    <button onClick={() => handleEditClick(job)}>Edit</button>
                  </>
                )}
                <button onClick={() => handleDelete(job._id)}>Delete</button>
                <button onClick={() => fetchApplicants(job._id)}>View Applicants</button>
              </div>
            ))
          ) : (
            <p>No jobs posted yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
