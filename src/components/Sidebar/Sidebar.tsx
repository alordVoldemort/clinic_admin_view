import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose = () => {} }) => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '/dashboard.svg'
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: '/appointments.svg'
    },
    {
      name: 'Contact Message',
      path: '/contact-message',
      icon: '/contact-message.svg'
    },
    {
      name: 'Testimonial',
      path: '/testimonial',
      icon: '/treatments.svg'
    },
    {
      name: "Log Out",
      path: "/login",
      icon: "/logout.svg"
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-outer">
        <div className="logo-section">
          <img 
            src="/logo.svg" 
            alt="Nirmal Health Care" 
            className="sidebar-logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'logo-fallback';
              fallback.innerHTML = `
                <div style="font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: #344054; margin-bottom: 4px;">
                  Admin Dashboard
                </div>
                <div style="font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 400; color: #667085;">
                  Home Health Care
                </div>
              `;
              target.parentNode?.appendChild(fallback);
            }}
          />
        </div>

        <div className="sidebar-inner">
          <nav className="nav-menu">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <div className="nav-icon-wrapper">
                  <img 
                    src={item.icon} 
                    alt={item.name}
                    className="nav-icon"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'nav-icon-fallback';
                      fallback.textContent = item.name.charAt(0);
                      target.parentNode?.appendChild(fallback);
                    }}
                  />
                </div>
                <span className="nav-label">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;