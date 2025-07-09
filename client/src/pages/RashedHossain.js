import React from 'react';
import UniversalHeader from '../components/UniversalHeader';
import '../styles/RashedHossain.css';

const RashedHossain = () => {
  return (
    <div className="rashed-page">
      <UniversalHeader />
      
      {/* Hero Section */}
      <section className="rashed-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Rashed Hossain</h1>
            <p className="designation">Founder & CEO of Banglay IELTS</p>
            <p className="sub-designation">Leading IELTS Expert in Bangladesh</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="rashed-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src="https://scontent.fdac22-2.fna.fbcdn.net/v/t39.30808-6/512050270_10017215941665182_1826409481844935038_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeE1423crHy-3sbusgWa7dL9rslk4AdItCSuyWTgB0i0JJKOM-3X8q0fbFTuQc0d3bixlxvIzavcWqxTATwe9-Pk&_nc_ohc=1-FTOvO7FCIQ7kNvwGwbpCx&_nc_oc=AdkUYbiVJg1SjcSnIK6sfqYNwsVvsoFicVBK_9R9DKInCa9s95ixvuRRWVcQV7nFDrY&_nc_zt=23&_nc_ht=scontent.fdac22-2.fna&_nc_gid=vdujpW6kwvCpsF7GZhe9_A&oh=00_AfQmo_6K2ND6d4r0IqInwVNmvij7Pjkb7QndQxmVGtqhvQ&oe=6874380A" alt="Rashed Hossain - Founder & CEO of Banglay IELTS" />
              <div className="social-links">
                <a href="https://facebook.com/rashed" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://youtube.com/rashed" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://linkedin.com/in/rashed" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="about-content">
              <h2>About Me</h2>
              <p className="intro">
                As the Founder and CEO of Banglay IELTS, I've dedicated my career to revolutionizing IELTS preparation in Bangladesh. 
                My vision was to create a platform where students could learn IELTS in their native language, making it more accessible 
                and understandable. Through innovative teaching methods and a deep understanding of Bangladeshi students' needs, 
                I've helped thousands achieve their dreams of studying abroad.
              </p>
              <div className="achievements">
                <div className="achievement-item">
                  <i className="fas fa-users"></i>
                  <h3>10,000+</h3>
                  <p>Students Trained</p>
                </div>
               
                <div className="achievement-item">
                  <i className="fas fa-certificate"></i>
                  <h3>5+</h3>
                  <p>Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="container">
          <h2>Our Vision</h2>
          <div className="vision-content">
            <p>
              At Banglay IELTS, we believe that language should never be a barrier to achieving your dreams. 
              Our mission is to make IELTS preparation accessible, effective, and affordable for every Bangladeshi student. 
              Through our innovative approach of teaching IELTS in Bangla, we've created a unique learning environment 
              that resonates with our students' cultural context while preparing them for international success.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="expertise-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="expertise-grid">
            <div className="expertise-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>IELTS in Bangla</h3>
              <p>Comprehensive IELTS training delivered in Bangla for better understanding and results</p>
            </div>
            <div className="expertise-card">
              <i className="fas fa-book-reader"></i>
              <h3>Study Abroad Counseling</h3>
              <p>Expert guidance for international university admissions and visa processing</p>
            </div>
            <div className="expertise-card">
              <i className="fas fa-chalkboard-teacher"></i>
              <h3>Personalized Coaching</h3>
              <p>One-on-one mentoring with customized study plans for guaranteed results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>Success Stories</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="student-info">
                <img src="/path-to-student1.jpg" alt="Student" />
                <div>
                  <h4>Sakib Ahmed</h4>
                  <p>Band Score 8.0</p>
                </div>
              </div>
              <p className="testimonial-text">
                "Rashed Sir's unique approach of teaching IELTS in Bangla helped me understand the concepts deeply. His guidance was invaluable in achieving my target score."
              </p>
            </div>
            <div className="testimonial-card">
              <div className="student-info">
                <img src="/path-to-student2.jpg" alt="Student" />
                <div>
                  <h4>Nusrat Jahan</h4>
                  <p>Band Score 7.5</p>
                </div>
              </div>
              <p className="testimonial-text">
                "Banglay IELTS made the impossible possible. The way complex IELTS topics are explained in Bangla makes everything so much clearer."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2>Get in Touch</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <p>info@banglayielts.com</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <p>01329719502
                01329719503</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <p>Rahman Heights, Plot-01, 3rd floor, Road-13, Sector-4, Rajlokkhi, Uttara, Dhaka- 1230</p>
              </div>
            </div>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RashedHossain; 