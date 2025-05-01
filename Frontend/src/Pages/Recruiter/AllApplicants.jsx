import React, { useState } from "react";
import "../../Styles/Recruiter/AllApplicants.scss";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const AllApplicants = ({ jobId, applicants, onBack, refreshApplicants }) => {
  const [filter, setFilter] = useState("applied");

  const updateStatus = async (userId, status) => {
    try {
      await axios.put(`/api/job/update-status/${jobId}`, { userId, status });
      toast.success(`User marked as ${status}`);
      refreshApplicants(); // Refresh applicants in parent (PostedJobs)
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const renderApplicants = (list, type) => {
    if (!list || list.length === 0) return null;

    return list.map((applicant) => (
      <div className="applicant-card" key={applicant._id}>
        <p><strong>Name:</strong> {applicant.user?.name || applicant.name}</p>
        <p><strong>Email:</strong> {applicant.user?.email || applicant.email}</p>

        {type === "applied" && (
          <div className="action-buttons">
            {!applicants.shortlisted.some(a => a._id === applicant._id) && (
              <button onClick={() => updateStatus(applicant._id, "shortlisted")}>
                Shortlist
              </button>
            )}
            {!applicants.interviewed.some(a => a._id === applicant._id) && (
              <button onClick={() => updateStatus(applicant._id, "interviewed")}>
                Interview
              </button>
            )}
          </div>
        )}
      </div>
    ));
  };

  const getFilteredApplicants = () => {
    return applicants[filter] || [];
  };

  return (
    <div className="all-applicants-container">
      <ToastContainer />
      <button className="back-button" onClick={onBack}>
        <FaArrowLeft /> Back to Jobs
      </button>

      <h2>Applicants</h2>

      <div className="filter-section">
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interviewed">Interviewed</option>
        </select>
      </div>

      <div className="applicant-list">
        {getFilteredApplicants().length > 0 ? (
          renderApplicants(getFilteredApplicants(), filter)
        ) : (
          <p className="no-applicants">No applicants yet.</p>
        )}
      </div>
    </div>
  );
};

export default AllApplicants;
