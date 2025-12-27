import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../apis/admin";
import logo from "../../assets/logo/Group 1686550958.svg";
import "./Sidebar.css";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Navigate to login even if API call fails
      navigate("/login");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "/dashboard.svg",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "/appointments.svg",
    },
    {
      name: "Contact Message",
      path: "/contact-message",
      icon: "/contact-message.svg",
    },
    {
      name: "Testimonial",
      path: "/testimonial",
      icon: "/treatments.svg",
    },
    {
      name: "Log Out",
      path: "/login",
      icon: "/logout.svg",
      isLogout: true,
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-outer">
        <div className="logo-section">
          <NavLink 
            to="/dashboard" 
            className="logo-container" 
            onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              onClose();
            }}
          >
            <img
              src={logo}
              alt="Nirmal Health Care"
              className="sidebar-logo"
              onError={(e) => {
                console.error("Logo failed to load:", logo);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <span className="logo-text">Nirmal Health Care</span>
          </NavLink>
        </div>

        <div className="sidebar-inner">
          <nav className="nav-menu">
            {menuItems.map((item) => {
              if (item.isLogout) {
                return (
                  <div
                    key={item.path}
                    className="nav-item"
                    onClick={(e) => {
                      handleLogout(e);
                      onClose();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="nav-icon-wrapper">
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="nav-icon"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = document.createElement("div");
                          fallback.className = "nav-icon-fallback";
                          fallback.textContent = item.name.charAt(0);
                          target.parentNode?.appendChild(fallback);
                        }}
                      />
                    </div>
                    <span className="nav-label">{item.name}</span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    onClose();
                  }}
                >
                  <div className="nav-icon-wrapper">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="nav-icon"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className = "nav-icon-fallback";
                        fallback.textContent = item.name.charAt(0);
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>
                  <span className="nav-label">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
