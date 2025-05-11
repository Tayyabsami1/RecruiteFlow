# RecruiteFlow

A comprehensive web application designed to streamline the recruitment process for job seekers, recruiters, and administrators. RecruiteFlow connects talent with opportunities through an intuitive interface and AI-powered features.

![RecruiteFlow Logo](Frontend/public/FaviconLogo.png)

## Overview

RecruiteFlow transforms traditional recruitment by providing a centralized platform where:
- Job seekers can create profiles, upload resumes, and find matching job opportunities
- Recruiters can post jobs, review applications, and connect with qualified candidates
- Administrators can manage users, monitor platform statistics, and oversee job listings

## Tech Stack

### Frontend
- React.js with Vite
- Redux for state management
- Mantine UI and Material UI components
- SCSS for styling
- Axios for API requests
- Flask API for AI skills extraction

### Backend
- Node.js with Express
- MongoDB database
- Authentication with JWT
- File uploads for resumes and company logos

## Key Features

### For Job Seekers
- **Profile Management**: Create and update comprehensive profiles
- **Resume Upload**: Submit and store resume documents
- **AI Skills Extraction**: Automatically extract skills from uploaded resumes
- **Job Discovery**: Browse and apply to matching job opportunities
- **Application Tracking**: Monitor application status in a personalized dashboard

### For Recruiters
- **Company Profiles**: Create and manage company information
- **Job Posting**: Create detailed job listings with specific requirements
- **Applicant Management**: Review and process job applications
- **Candidate Filtering**: Sort and filter candidates based on qualifications
- **Communication**: Connect with potential hires through the platform

### For Administrators
- **User Management**: Oversee all platform users
- **Analytics Dashboard**: Track platform statistics and metrics
- **Content Moderation**: Monitor and manage job listings
- **System Oversight**: Ensure platform stability and compliance

## User Interface

The application features a responsive design with both light and dark mode options for comfortable viewing in any environment. The UI includes:

- **Homepage**: Introduction to the platform with featured jobs and testimonials
- **Dashboard**: Personalized view based on user type (job seeker, recruiter, admin)
- **About Page**: Information about the platform, team, and mission
- **Profile Pages**: Customized profile management for different user types
- **Job Listings**: Searchable and filterable job opportunities

## Project Structure

```
RecruiteFlow/
├── Frontend/
│   ├── public/
│   │   └── [static assets]
│   ├── src/
│   │   ├── App/
│   │   ├── Components/
│   │   ├── Features/
│   │   │   ├── Jobs/
│   │   │   └── User/
│   │   ├── Pages/
│   │   │   ├── Admin/
│   │   │   ├── JobSeeker/
│   │   │   └── Recruiter/
│   │   ├── Styles/
│   │   └── Utils/
├── Backend/
│   ├── src/
│   │   ├── Controllers/
│   │   │   ├── AdminControllers/
│   │   │   └── JobseekerController/
│   │   ├── DB/
│   │   ├── Middlewares/
│   │   ├── Models/
│   │   ├── Routes/
│   │   │   ├── AdminRoutes/
│   │   │   └── JobseekerRoutes/
│   │   └── Utils/
│   └── uploads/
│       ├── companyLogos/
│       └── resumes/
└── Documents/
```

## Distinctive Features

### AI-Powered Resume Analysis
The system can automatically extract skills and qualifications from uploaded resumes to improve job matching and save users time when completing their profiles.

### Secure File Storage
The application stores uploaded resumes and company logos in a structured file system, making them accessible when needed while maintaining security.

### Responsive Design
The UI is fully responsive and includes a dark mode option, ensuring a comfortable user experience across all devices and environments.

### Role-Based Access
Different user types (job seekers, recruiters, and administrators) have tailored experiences with appropriate permissions and features.

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/RecruiteFlow.git
cd RecruiteFlow
```

2. Install dependencies for both frontend and backend:
```bash
# Frontend dependencies
cd Frontend
npm install

# Backend dependencies
cd ../Backend
npm install
```

3. Set up environment variables:
   - Create `.env` file in the Backend directory based on `example.env`
   - Create `.env` file in the Frontend directory based on `sample.env`

4. Start the development servers:
```bash
# Start Backend server
cd Backend
npm run dev

# Start Frontend development server
cd Frontend
npm run dev
```

## Contributors

The RecruiteFlow platform was developed by a team of dedicated developers passionate about improving the recruitment process.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to all the contributors who helped make this project possible
- Inspired by the need for more efficient and transparent recruitment processes in the job market
