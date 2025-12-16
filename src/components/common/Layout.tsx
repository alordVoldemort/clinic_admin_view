import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="main-layout-content">
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="page-content">
          {children}
        </main>
      </div>
      {sidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar}></div>
      )}
    </div>
  );
};

export default Layout;