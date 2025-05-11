import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../Styles/Recruiter/AllApplicants.scss";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowLeft, FaUser, FaEnvelope, FaSpinner, FaCheckCircle, FaUserCheck } from "react-icons/fa";
import axios from "axios";

const AllApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("applied");
  const [applicants, setApplicants] = useState({
    applied: [],
    shortlisted: [],
    interviewed: []
  });
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");

  // Optimized with useCallback
  const fetchJobDetails = useCallback(async () => {
    try {
      const res = await axios.get(`/api/job/${jobId}`);
      setJobTitle(res.data.title || "Job Position");
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  }, [jobId]);

  // Optimized with useCallback
  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/job/applicants/${jobId}`);
      setApplicants({
        jobId,
        applied: res.data.applied || [],
        shortlisted: res.data.shortlisted || [],
        interviewed: res.data.interviewed || []
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
    fetchJobDetails();
  }, [jobId, fetchApplicants, fetchJobDetails]);

  // Optimized with useCallback
  const updateStatus = useCallback(async (userId, status) => {
    try {
      await axios.put(`/api/job/update-status/${jobId}`, { userId, status });
      toast.success(`User marked as ${status}`);
      fetchApplicants(); // Refresh applicants
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  }, [jobId, fetchApplicants]);

  // Optimized with useCallback
  const renderApplicants = useCallback((list, type) => {
    if (!list || list.length === 0) return null;

    return list.map((applicant) => (
      <div className="applicant-card" key={applicant._id}>
        <div className="applicant-header">
          <div className="applicant-avatar">
            {applicant.user?.name?.charAt(0) || applicant.name?.charAt(0) || "A"}
          </div>
          <div className="applicant-info">
            <h3>{applicant.user?.name || applicant.name}</h3>
            <p className="email"><FaEnvelope /> {applicant.user?.email || applicant.email}</p>
          </div>
        </div>
        
        <div className="applicant-details">
          {applicant.resumeUrl && (
            <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-link">
              View Resume
            </a>
          )}
        </div>

        {type === "applied" && (
          <div className="action-buttons">
            {!applicants.shortlisted.some(a => a._id === applicant._id) && (
              <button 
                className="shortlist-btn"
                onClick={() => updateStatus(applicant._id, "shortlisted")}
              >
                <FaCheckCircle /> Shortlist
              </button>
            )}
            {!applicants.interviewed.some(a => a._id === applicant._id) && (
              <button 
                className="interview-btn"
                onClick={() => updateStatus(applicant._id, "interviewed")}
              >
                <FaUserCheck /> Interview
              </button>
            )}
          </div>
        )}
      </div>
    ));
  }, [applicants.shortlisted, applicants.interviewed, updateStatus]);

  // Optimized with useMemo
  const getFilteredApplicants = useMemo(() => {
    return applicants[filter] || [];
  }, [applicants, filter]);

  // Optimized with useMemo
  const statusCounts = useMemo(() => {
    return {
      applied: applicants.applied?.length || 0,
      shortlisted: applicants.shortlisted?.length || 0,
      interviewed: applicants.interviewed?.length || 0
    };
  }, [applicants]);

  // Optimized with useCallback
  const getStatusCount = useCallback((status) => {
    return statusCounts[status];
  }, [statusCounts]);

  // Optimized with useCallback
  const handleNavigateBack = useCallback(() => {
    navigate("/Recruiter/postedjobs");
  }, [navigate]);

  // Optimized with useCallback
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  return (
    <div className="all-applicants-container">
      <ToastContainer />
      <button className="back-button" onClick={handleNavigateBack}>
        <FaArrowLeft /> Back to Jobs
      </button>

      <div className="page-header">
        <h2>Applicants for {jobTitle}</h2>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-count">{getStatusCount('applied')}</span>
            <span className="stat-label">Applied</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">{getStatusCount('shortlisted')}</span>
            <span className="stat-label">Shortlisted</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">{getStatusCount('interviewed')}</span>
            <span className="stat-label">Interviewed</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading applicants...</p>
        </div>
      ) : (
        <>
          <div className="filter-section">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'applied' ? 'active' : ''}`}
                onClick={() => handleFilterChange('applied')}
              >
                Applied ({getStatusCount('applied')})
              </button>
              <button 
                className={`filter-tab ${filter === 'shortlisted' ? 'active' : ''}`}
                onClick={() => handleFilterChange('shortlisted')}
              >
                Shortlisted ({getStatusCount('shortlisted')})
              </button>
              <button 
                className={`filter-tab ${filter === 'interviewed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('interviewed')}
              >
                Interviewed ({getStatusCount('interviewed')})
              </button>
            </div>
          </div>

          <div className="applicant-list">
            {getFilteredApplicants.length > 0 ? (
              renderApplicants(getFilteredApplicants, filter)
            ) : (
              <div className="no-applicants">
                <FaUser className="empty-icon" />
                <p>No {filter} applicants yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AllApplicants;
