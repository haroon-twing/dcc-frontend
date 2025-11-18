import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ 
  open, 
  isOpen, 
  onOpenChange, 
  onClose, 
  title, 
  size = 'md',
  children 
}) => {
  const [mounted, setMounted] = useState(false);
  const isModalOpen = open ?? isOpen ?? false;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onOpenChange) {
      onOpenChange(false);
    }
  };

  if (!isModalOpen || !mounted) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
  };
  
  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center px-4 py-6"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
      onClick={handleClose}
    >
      <div 
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto rounded-lg border bg-background p-6 shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
          </div>
        )}
        <div className="flex-1">
          {children}
        </div>
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
