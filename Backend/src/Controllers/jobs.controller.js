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