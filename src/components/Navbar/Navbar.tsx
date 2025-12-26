import React, { useEffect, useState, useRef } from "react";
import { getStoredAdminData, getProfile } from "../../apis/admin";
import {
  getNotifications,
  getUnseenCount,
  markAsSeen,
} from "../../apis/notifications";
import { formatRelativeTime } from "../../utils/dateUtils";
import "./Navbar.css";

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarOpen }) => {
  const [adminData, setAdminData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load admin data from localStorage first
    const storedData = getStoredAdminData();
    if (storedData) {
      setAdminData(storedData);
    }

    // Optionally fetch fresh data from API
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success && response.data?.admin) {
          setAdminData(response.data.admin);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Keep using stored data if API call fails
      }
    };

    fetchProfile();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notificationsResponse, countResponse] = await Promise.all([
          getNotifications(10),
          getUnseenCount(),
        ]);

        if (
          notificationsResponse.success &&
          notificationsResponse.data?.notifications
        ) {
          setNotifications(notificationsResponse.data.notifications);
        }

        if (countResponse.success && countResponse.data?.count !== undefined) {
          setUnseenCount(countResponse.data.count);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Fetch notifications when dropdown opens (refresh to get latest)
  useEffect(() => {
    if (showNotifications) {
      const fetchLatestNotifications = async () => {
        try {
          const [notificationsResponse, countResponse] = await Promise.all([
            getNotifications(10),
            getUnseenCount(),
          ]);

          if (
            notificationsResponse.success &&
            notificationsResponse.data?.notifications
          ) {
            setNotifications(notificationsResponse.data.notifications);
          }

          if (
            countResponse.success &&
            countResponse.data?.count !== undefined
          ) {
            setUnseenCount(countResponse.data.count);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchLatestNotifications();
    }
  }, [showNotifications]);

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markAsSeen(notificationId, false);
      // Remove clicked notification from UI
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnseenCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  const handleMarkAllAsSeen = async () => {
    try {
      await markAsSeen(undefined, true);
      // Remove all notifications from UI
      setNotifications([]);
      setUnseenCount(0);
    } catch (error) {
      console.error("Error marking all notifications as seen:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    return type === "appointment" ? "📅" : "📩";
  };
  return (
    <header className="navbar">
      {/* Mobile Menu Toggle Button */}
      <button
        className={`mobile-menu-toggle ${sidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="navbar-container">
        <div className="search-section">
          {/* <div className="search-container">
            <div className="search-icon-wrapper">
              <img
                src="/search.svg"
                alt="Search"
                className="search-icon"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className = "search-icon-fallback";
                  fallback.innerHTML = "🔍";
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>

            <input type="text" className="search-input" placeholder="Search" />
          </div> */}
        </div>

        <div className="right-section">
          <div
            className="notification-icon"
            ref={notificationRef}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <img
              src="/notification.svg"
              alt="Notifications"
              className="bell-icon"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = document.createElement("div");
                fallback.className = "bell-fallback";
                fallback.innerHTML = "🔔";
                target.parentNode?.appendChild(fallback);
              }}
            />
            {unseenCount > 0 && (
              <span className="notification-badge">
                {unseenCount > 9 ? "9+" : unseenCount}
              </span>
            )}

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      className="mark-all-seen-btn"
                      onClick={handleMarkAllAsSeen}
                      title="Mark all as seen"
                    >
                      Mark all as seen
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="notification-item"
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="notification-icon-emoji">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <p className="notification-message">
                            {notification.message}
                          </p>
                          <span className="notification-time">
                            ⏱ {formatRelativeTime(notification.created_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="admin-profile">
            <div className="admin-text">
              <p className="admin-name">Admin</p>
            </div>

            <div className="admin-avatar">A</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
