import Job from '../Models/job.model.js';  // Adjust the path based on your project structure
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

// Unapply from a job
export const unapplyFromJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.whoApplied = job.whoApplied.filter((id) => id.toString() !== userId);
    await job.save();

    res.status(200).json({ message: "Successfully unapplied" });
  } catch (error) {
    res.status(500).json({ message: "Error unapplying for job", error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.find({ status: "open" });
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

  
