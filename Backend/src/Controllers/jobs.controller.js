import {Job} from '../Models/job.model.js';  // Adjust the path based on your project structure
export const postJob = async (req, res) => {
    try {
        const jobData = req.body;

        // If the optional arrays are not provided in the request, they will default to empty arrays due to the schema definition
        const newJob = await Job.create(jobData); 

        res.status(201).json({
            message: "Job posted successfully",
            data: {
                createdJob: newJob,
                status: 'Job has been posted successfully'
            }
        });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ error: "Error posting job", details: error.message });
    }
};


// Apply to a job
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.whoApplied?.includes(userId)) {
      job.whoApplied.push(userId);
      await job.save();
    }

    res.status(200).json({ message: "Successfully applied" });
  } catch (error) {
    res.status(500).json({ message: "Error applying for job", error: error.message });
  }
};


export const getJobs = async (req, res) => {
  try {
    const { jobseekerId } = req.params;

    // Find jobs with status "open" and where jobseekerId is not in the whoApplied array
    const jobs = await Job.find({
      status: "open",
      whoApplied: { $nin: [jobseekerId] }
    });


    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const jobs = await Job.find({ status: "open" });
   
    const appliedJobs = jobs.filter((job) =>
      job.whoApplied.includes(userId)
    );
    const shortlistedJobs = jobs.filter((job) =>
      job.shortlisted.includes(userId)
    );
    const interviewedJobs = jobs.filter((job) =>
      job.interviewed.includes(userId)
    );

    res.status(200).json({
      appliedJobs,
      shortlistedJobs,
      interviewedJobs,
    });
  } catch (error) {
    console.error("Error fetching dashboard jobs:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};
//Getting Jobs logic for recruiters
export const getPostedJobsByRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    const jobs = await Job.find({
      whoPosted: recruiterId
    });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs posted by recruiter:", error);
    res.status(500).json({
      message: "Failed to fetch posted jobs",
      error: error.message,
    });
  }
};


// Update a job by ID
export const updateJob = async (req, res) => {
  try {
    const { title, location, experienceLevel, skills, industry, status } = req.body;

    const updatedFields = {
      ...(title && { title }),
      ...(location && { location }),
      ...(experienceLevel && { experienceLevel }),
      ...(skills && { skills }), // should be an array
      ...(industry && { industry }),
      ...(status && { status }),
    };

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a job by ID
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get categorized applicants for a job
export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate({
        path: "whoApplied",
        model: "JobSeeker",
        populate: {
          path: "user",
          model: "User",
          select: "name email",
        },
      })
      .populate({
        path: "shortlisted",
        model: "JobSeeker",
        populate: {
          path: "user",
          model: "User",
          select: "name email",
        },
      })
      .populate({
        path: "interviewed",
        model: "JobSeeker",
        populate: {
          path: "user",
          model: "User",
          select: "name email",
        },
      });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      applied: job.whoApplied,
      shortlisted: job.shortlisted,
      interviewed: job.interviewed,
    });
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update applicant status
export const updateApplicantStatus = async (req, res) => {
  const { jobId } = req.params;
  const { userId, status } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const hasApplied = job.whoApplied.some(applicantId => applicantId.toString() === userId);
    if (!hasApplied) {
      return res.status(404).json({ message: "Applicant not found in whoApplied list" });
    }

    // Remove from both arrays first to prevent duplicates
    job.shortlisted = job.shortlisted.filter(id => id.toString() !== userId);
    job.interviewed = job.interviewed.filter(id => id.toString() !== userId);

    if (status === "shortlisted") {
      job.shortlisted.push(userId);
    } else if (status === "interviewed") {
      job.interviewed.push(userId);
    }

    await job.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};




