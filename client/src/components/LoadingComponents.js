import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'লোড হচ্ছে...' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'spinner-border-sm';
      case 'large':
        return 'spinner-border-lg';
      default:
        return '';
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <div 
          className={`spinner-border text-primary ${getSizeClass()} mb-3`} 
          role="status"
          style={{
            width: size === 'large' ? '4rem' : size === 'small' ? '1.5rem' : '3rem',
            height: size === 'large' ? '4rem' : size === 'small' ? '1.5rem' : '3rem'
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted fw-medium">{text}</p>
      </div>
    </div>
  );
};

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="fas fa-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              <h4 className="text-danger mb-3">দুঃখিত! কিছু সমস্যা হয়েছে</h4>
              <p className="text-muted mb-4">{message}</p>
              <div className="d-flex justify-content-center gap-3">
                {onRetry && (
                  <button 
                    onClick={onRetry}
                    className="btn btn-outline-primary rounded-pill px-4"
                  >
                    <i className="fas fa-redo me-2"></i>
                    আবার চেষ্টা করুন
                  </button>
                )}
                <button 
                  onClick={() => window.location.href = '/'}
                  className="btn btn-primary rounded-pill px-4"
                >
                  <i className="fas fa-home me-2"></i>
                  হোমে ফিরুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessMessage = ({ message, duration = 3000, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="alert alert-success alert-dismissible fade show" role="alert">
      <i className="fas fa-check-circle me-2"></i>
      {message}
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export { ErrorMessage, LoadingSpinner, SuccessMessage };

