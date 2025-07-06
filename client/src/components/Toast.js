import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show toast
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Hide toast after duration
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'warning':
        return 'bg-warning text-dark';
      default:
        return 'bg-primary text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-info-circle';
    }
  };

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div 
      className={`toast-container position-fixed top-0 end-0 p-3`}
      style={{ zIndex: 9999 }}
    >
      <div 
        className={`toast show ${getTypeClass()} border-0 shadow-lg`}
        style={{
          transform: isLeaving ? 'translateX(100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out',
          minWidth: '300px',
          borderRadius: '10px'
        }}
      >
        <div className="toast-body d-flex align-items-center p-3">
          <i className={`${getIcon()} me-3`} style={{ fontSize: '1.2rem' }}></i>
          <div className="flex-grow-1">
            {message}
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white ms-2" 
            onClick={() => {
              setIsLeaving(true);
              setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
              }, 300);
            }}
          ></button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Toast manager
class ToastManager {
  static toasts = [];

  static show(message, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration
    };

    this.toasts.push(toast);
    this.render();

    return id;
  }

  static hide(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.render();
  }

  static render() {
    const container = document.getElementById('toast-root') || (() => {
      const div = document.createElement('div');
      div.id = 'toast-root';
      document.body.appendChild(div);
      return div;
    })();

    ReactDOM.render(
      <div>
        {this.toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => this.hide(toast.id)}
          />
        ))}
      </div>,
      container
    );
  }

  static success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  static warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }
}

export { Toast, ToastManager };
