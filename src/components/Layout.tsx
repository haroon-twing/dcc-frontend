import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="h-full page-transition">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;


