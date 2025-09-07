import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastNotification from '../components/common/ToastNotification';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toast,
      open: true,
    };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    if (toast.autoHide !== false) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 4000);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message, options = {}) => {
    addToast({
      message,
      type: 'success',
      ...options,
    });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    addToast({
      message,
      type: 'error',
      ...options,
    });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    addToast({
      message,
      type: 'warning',
      ...options,
    });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    addToast({
      message,
      type: 'info',
      ...options,
    });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
    toasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render all toasts */}
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          open={toast.open}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          showIcon={toast.showIcon}
          showCloseButton={toast.showCloseButton}
          autoHide={toast.autoHide}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}; 