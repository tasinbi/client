import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center p-5">
              <i className="fas fa-exclamation-triangle text-warning mb-3" style={{ fontSize: '4rem' }}></i>
              <h2 className="text-dark mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">
                The page you're looking for doesn't exist or may have been moved.
              </p>
              <div className="d-flex justify-content-center">
                <Link to="/" className="btn btn-primary btn-lg rounded-pill px-4">
                  <i className="fas fa-home me-2"></i>Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 