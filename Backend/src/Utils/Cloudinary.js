import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.API_SECRET
});

export const uploadOnCloudinary = async (fileData, folder = "recruiteflow") => {
    try {
        if (!fileData) return null;

        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(fileData,
            {
                resource_type: 'raw', folder: folder, format: "pdf", type: "upload",
                access_mode:"public",
                context:"alt=pdf document"
            }
        );

        console.log("File uploaded to Cloudinary:", response.secure_url);

        return {
            url: response.url,
            secure_url: response.secure_url,
            public_id: response.public_id,
            format: response.format,
            resource_type: response.resource_type
        };
    }
    catch (err) {
        console.error("Error uploading to Cloudinary:", err);
        return null;
    }
}