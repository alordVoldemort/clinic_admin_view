import React from 'react';
import './Navbar.css';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <header className="navbar">
      {/* Mobile Menu Toggle Button */}
      <button 
        className={`mobile-menu-toggle ${sidebarOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className="navbar-container">
        <div className="search-section">
          <div className="search-container">
            <div className="search-icon-wrapper">
              <img 
                src="/search.svg" 
                alt="Search" 
                className="search-icon"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'search-icon-fallback';
                  fallback.innerHTML = '🔍';
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>
            
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search" 
            />
          </div>
        </div>

        <div className="right-section">
          <div className="notification-icon">
            <img 
              src="/notification.svg" 
              alt="Notifications" 
              className="bell-icon"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'bell-fallback';
                fallback.innerHTML = '🔔';
                target.parentNode?.appendChild(fallback);
              }}
            />
            <span className="notification-badge">3</span>
          </div>

          <div className="admin-text">
            <p className="admin-name">Dr. Nitin Darda</p>
            <p className="admin-role">Admin</p>
          </div>
          
          <div className="profile-photo">
            <img 
              src="/profile-photo.jpg" 
              alt="Dr. Nitin Darda"
              className="profile-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'photo-fallback';
                fallback.textContent = 'ND';
                target.parentNode?.appendChild(fallback);
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;