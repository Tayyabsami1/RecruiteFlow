import React from 'react'
import "../Styles/Home.scss"
import { useMantineColorScheme } from '@mantine/core';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { User } = useSelector((state) => state.User);

  return (
    <div className={`home-container ${isDark ? 'dark-mode' : ''}`}>

      <section className={`hero-section ${isDark ? 'dark-mode' : ''}`}>
        
        <div className="hero-content">
          <h1>{User ? `Welcome back, ${User.name}` : 'Welcome to Recruit Flow'}</h1>
          <p>Streamlining the recruitment process for job seekers and recruiters alike</p>          <div className="hero-buttons">
            {User ? (
              <>
                <Link to={'dashboard'}>
                  <button className="primary-btn">My Dashboard</button>
                </Link>
                <Link to={User.userType === 'Recruiter' ? 'post-job' : '/jobs'}> 
                  <button className="secondary-btn">{User.userType === 'Recruiter' ? 'Post a Job' : 'Find Jobs'}</button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <button className="primary-btn">Get Started</button>
                </Link>
                <Link to="/about">
                  <button className="secondary-btn">Learn More</button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-image">
          <div className="abstract-shape"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`features-section ${isDark ? 'dark-mode' : ''}`}>
        <h2>Why Choose Recruit Flow</h2>
        <p className="section-description">Our platform offers powerful tools to connect talent with opportunity</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Smart Job Matching</h3>
            <p>AI-powered matching connects candidates with the perfect opportunities</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Easy Application</h3>
            <p>Streamlined application process with profile tracking</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Comprehensive insights for recruiters and job seekers</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Your data is protected with enterprise-grade security</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`how-it-works ${isDark ? 'dark-mode' : ''}`}>
        <h2>How Recruit Flow Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Your Profile</h3>
            <p>Sign up and build your comprehensive profile as a job seeker or recruiter</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Connect & Discover</h3>
            <p>Browse opportunities or candidates based on your requirements</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Engage & Communicate</h3>
            <p>Interact through our secure messaging system</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Finalize & Succeed</h3>
            <p>Complete the recruitment process and achieve your goals</p>
          </div>
        </div>
      </section>

      {/* Personalized Section for Logged-in Users */}
      {User && (
        <section className={`personalized-section ${isDark ? 'dark-mode' : ''}`}>
          <h2>Personalized For You</h2>
          <div className="personalized-container">
            {User.userType === 'Jobseeker' ? (
              <div className="personalized-content">
                <h3>Ready to advance your career?</h3>
                <p>Based on your profile, we've found job opportunities that match your skills and experience.</p>
                <Link to="/jobs">
                  <button className="primary-btn">Explore Matching Jobs</button>
                </Link>
              </div>
            ) : (
              <div className="personalized-content">
                <h3>Find the perfect candidates</h3>
                <p>Post a job listing or browse profiles of qualified candidates ready to join your team.</p>
                <div className="action-buttons">
                  <Link to="post-job">
                    <button className="primary-btn">Post a Job</button>
                  </Link>
                  <Link to="postedjobs">
                    <button className="secondary-btn">Browse Candidates</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className={`testimonials-section ${isDark ? 'dark-mode' : ''}`}>
        <h2>What Our Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>"Recruit Flow transformed our hiring process. We've found talented professionals quickly and efficiently."</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>HR Manager, Tech Solutions Inc.</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <p>"As a job seeker, Recruit Flow helped me connect with opportunities that truly matched my skills and aspirations."</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h4>Michael Chen</h4>
                <p>Software Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Different for logged in vs logged out users */}
      <section className={`cta-section ${isDark ? 'dark-mode' : ''}`}>
        <div className="cta-content">
          {User ? (
            <>
              <h2>{User.userType === 'Jobseeker' ? 'Ready to Find Your Dream Job?' : 'Need to Expand Your Team?'}</h2>
              <p>{User.userType === 'Jobseeker' 
                ? 'Update your profile to improve matching and increase your chances of getting noticed by recruiters.' 
                : 'Create a compelling job listing to attract the best talent for your organization.'}</p>
              <Link to={User.userType === 'Jobseeker' ? '/profile' : 'post-job'}>
                <button className="primary-btn">
                  {User.userType === 'Jobseeker' ? 'Update Profile' : 'Post a Job'}
                </button>
              </Link>
            </>
          ) : (
            <>
              <h2>Ready to Transform Your Recruitment Experience?</h2>
              <p>Join thousands of job seekers and recruiters who are simplifying their hiring process with Recruit Flow.</p>
              <Link to="/signup">
                <button className="primary-btn">Sign Up Now</button>
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home