import React from 'react';
import UniversalHeader from '../components/UniversalHeader';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <UniversalHeader />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">About Banglay IELTS</h1>
          <p className="about-subtitle">Your trusted partner for IELTS preparation in Bangladesh</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="container">
          <div className="section-content">
            <div className="section-text">
              <h2 className="section-title">Our Mission</h2>
              <p className="section-description">
                At Banglay IELTS, our mission is to make IELTS preparation accessible, effective, and affordable for every Bangladeshi student. We believe in empowering students with quality education and personalized guidance to achieve their desired band scores.
              </p>
            </div>
            <div className="section-image">
              <img src="https://scontent.fdac22-2.fna.fbcdn.net/v/t39.30808-6/502769942_1065569068965559_1997643435910111663_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeEhKnoFmt0qbqO4toRE23sFhMMo29fi4SmEwyjb1-LhKTN__QdVjePekGiCDyFdAzvoUWB_F-SW-crdOLQjj8WO&_nc_ohc=kIflQXekPD4Q7kNvwFkjbQW&_nc_oc=AdkeEAa32JdnFKPkCR578TOZox2v4zi_jrANfOUQ42NJ4IMFXk-DVKSAmPXcz4bfiNQ&_nc_zt=23&_nc_ht=scontent.fdac22-2.fna&_nc_gid=CaLrmAzSUP9TtYCqrmlxjg&oh=00_AfRVfRklMKKCMx7ODYfYMgg0j6azsrX4dC63kY3NWzjplA&oe=6873FE0F" alt="Our Mission" className="about-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-section features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3 className="feature-title">Expert Teachers</h3>
              <p className="feature-description">
                Learn from experienced IELTS trainers with proven track records of student success.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <h3 className="feature-title">Comprehensive Materials</h3>
              <p className="feature-description">
                Access high-quality study materials, practice tests, and resources designed for success.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="feature-title">Small Batch Size</h3>
              <p className="feature-description">
                Personalized attention in small groups ensures better learning outcomes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="feature-title">Flexible Schedule</h3>
              <p className="feature-description">
                Choose from multiple batches to fit your schedule perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-section stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">100000+</div>
              <div className="stat-label">Students Trained</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">7.5+</div>
              <div className="stat-label">Average Band Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Trainers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-section contact-section">
        <div className="container">
          <div className="section-content">
            <div className="section-text">
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-description">
                Have questions about our programs? We're here to help you achieve your IELTS goals.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>01329719502
                  01329719503</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>info@banglayielts.com</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Rahman Heights, Plot-01, 3rd floor, Road-13, Sector-4, Rajlokkhi, Uttara, Dhaka- 1230</span>
                </div>
              </div>
            </div>
            <div className="section-image">
              <img src="https://banglayielts.com/wp-content/uploads/2024/11/photo_2024-11-23_11-46-18-e1750146016889.jpg" alt="Contact Us" className="about-image" />
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default About; 