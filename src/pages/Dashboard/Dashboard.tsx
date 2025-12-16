import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';

import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [checkedRows, setCheckedRows] = useState<number[]>([0, 2, 4]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [timeFilter, setTimeFilter] = useState<string>('Last Week'); // New state for time filter
  const [showTimeDropdown, setShowTimeDropdown] = useState(false); // State for dropdown visibility
  
  const totalPages = 10;

  const appointments = [
    { 
      patient: 'Riya Patil',
      email: 'riya.p@sumago.com',
      doctor: 'Dr. Nitin Darda',
      date: '2024-12-06',
      time: '09:00 AM',
      type: 'Spine Treatments',
      phone: '9867523490',
      status: 'Confirmed'
    },
    { 
      patient: 'Rajesh Patil',
      email: 'showtraders@yahoo.com',
      doctor: 'Dr. Yogita Darda',
      date: '2024-12-06',
      time: '10:30 AM',
      type: 'Spine Treatments',
      phone: '9012314567',
      status: 'Pending'
    },
    { 
      patient: 'Rakesh Shetty',
      email: 'guptasup@gmail.com',
      doctor: 'Dr. Tanmay Darda',
      date: '2024-12-06',
      time: '11:00 AM',
      type: 'Gynecology Treatment',
      phone: '9876543210',
      status: 'Cancelled'
    },
    { 
      patient: 'Kiran More',
      email: 'kmoretrans@gmail.com',
      doctor: 'Dr. Nitin Darda',
      date: '2024-12-06',
      time: '02:00 PM',
      type: 'Treatment Information',
      phone: '9867523490',
      status: 'Confirmed'
    },
    { 
      patient: 'Sunita Shah',
      email: 'sharmasteel@gmail.com',
      doctor: 'Dr. Yogita Darda',
      date: '2024-12-06',
      time: '09:30 AM',
      type: 'Kidney Treatment',
      phone: '9876543210',
      status: 'Pending'
    }
  ];

  const alerts = [
    'Dr. Yogita Darda has 3 back-to-back appointments today',
    '2 patients waiting for prescription refill approval',
    'Lab results ready for 5 patients'
  ];

  // Status options for dropdown
  const statusOptions = ['All Status', 'Confirmed', 'Pending', 'Cancelled'];
  
  const timeOptions = ['Last Week', 'Last Month', 'Last Year'];

  const handleCheckboxChange = (index: number) => {
    setCheckedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (checkedRows.length === appointments.length) {
      setCheckedRows([]);
    } else {
      setCheckedRows(appointments.map((_, index) => index));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleTimeFilterChange = (option: string) => {
    setTimeFilter(option);
    setShowTimeDropdown(false);
  };

  // Filter appointments based on search query and status filter
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.phone.includes(searchQuery) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
       
        <div className="dashboard-content">
          
          {/* Welcome Section with Time Filter */}
          <div className="welcome-section">
            <div className="welcome-header">
              <div className="welcome-text">
                <h1 className="welcome-title">Dashboard</h1>
                <p className="welcome-subtitle">Welcome back! Here's what's happening today.</p>
              </div>
              <div className="time-filter-container">
                <button 
                  className="time-filter-btn"
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                >
                  <div className="time-filter-content">
                    <img 
                      src="/calendar.svg" 
                      alt="Calendar"
                      className="calendar-icon"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'calendar-icon-fallback';
                        fallback.textContent = '📅';
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                    <span className="time-filter-text">{timeFilter}</span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                </button>
                {showTimeDropdown && (
                  <div className="time-filter-dropdown">
                    {timeOptions.map((option) => (
                      <button
                        key={option}
                        className={`time-filter-option ${timeFilter === option ? 'selected' : ''}`}
                        onClick={() => handleTimeFilterChange(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-container">
            {/* Total Patients Card */}
            <div className="total-patients-card">
              <div className="card-content">
                <h3 className="card-title">Total Patients</h3>
                <h2 className="card-number">1,204</h2>
              </div>
              <div className="card-icon">
                <img 
                  src="/total-patients.svg" 
                  alt="Total Patients"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'card-icon-fallback';
                    fallback.textContent = '👥';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
            </div>

            {/* Today's Patients Card */}
            <div className="today-patients-card">
              <div className="today-card-content">
                <h3 className="today-title">Today's Patients</h3>
                <h2 className="today-number">24</h2>
              </div>
              <div className="today-card-icon">
                <img 
                  src="/today-patients.svg" 
                  alt="Today's Patients"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'today-card-icon-fallback';
                    fallback.textContent = '📊';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="dashboard-main">
            
            <div className="dashboard-left">
              
              <div className="alerts-section">
                <div className="alerts-header">
                <img
                  src= "/alerts-bell.svg" 
                    alt="Alerts"
                    className="alerts-bell-icon"
                  />  
                  <h2 className="alerts-title">Alerts & Notifications</h2>
                </div>
                <ul className="alerts-list">
                  {alerts.map((alert, index) => (
                    <li key={index} className="alert-item">
                      <span className="alert-bullet">•</span>
                      <p className="alert-text">{alert}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Appointments Section */}
              <div className="appointments-section">
                <div className="section-header">
                  <h2 className="section-title">Appointments</h2>
                </div>

                {/* Filter Row - Below Appointments Title */}
                <div className="filter-row">
                  <div className="appointments-search-container">
                    <div className="appointments-search-icon-wrapper">
                      <img 
                        src="/search.svg" 
                        alt="Search"
                        className="appointments-search-svg-icon"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'appointments-search-icon-fallback';
                          fallback.textContent = '🔍';
                          target.parentNode?.appendChild(fallback);
                        }}
                      />
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Search"
                      className="appointments-search-input"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  
                  <div className="filter-dropdown-container">
  <div className="filter-select-wrapper">
    <img 
      src="./filter-icon.svg"
      alt="Filter"
      className="filter-icon"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.className = 'filter-icon-fallback';
        fallback.textContent = '⚙️';
        target.parentNode?.appendChild(fallback);
      }}
    />
    <select 
      value={statusFilter} 
      onChange={handleStatusFilterChange}
      className="filter-select"
    >
      {statusOptions.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
</div>
                </div>

                <div className="table-horizontal-scroll-container">
                  <div className="table-wrapper">
                    <table className="appointments-table">
                      <thead>
                        <tr>
                          <th>
                            <div className="checkbox-header">
                              <div 
                                className={`custom-checkbox ${checkedRows.length === appointments.length ? 'checked' : ''}`}
                                onClick={handleSelectAll}
                              >
                                <span className="checkmark">✓</span>
                              </div>
                            </div>
                          </th>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Type</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.map((appointment, index) => (
                          <tr key={index}>
                            <td>
                              <div className="checkbox-cell">
                                <div 
                                  className={`custom-checkbox ${checkedRows.includes(index) ? 'checked' : ''}`}
                                  onClick={() => handleCheckboxChange(index)}
                                >
                                  <span className="checkmark">✓</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="patient-info">
                                <div className="patient-name">{appointment.patient}</div>
                                <div className="patient-email">{appointment.email}</div>
                              </div>
                            </td>
                            <td>{appointment.doctor}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.time}</td>
                            <td>{appointment.type}</td>
                            <td>{appointment.phone}</td>
                            <td>
                              <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                                {appointment.status}
                              </span>
                            </td>
                            <td>
  <div className="actions-container">
    <img 
      src="/delete.svg" 
      alt="Delete"
      className="delete-action-icon"  
      onClick={() => {
        console.log('Delete appointment', index);
      }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.className = 'delete-action-fallback';
        fallback.textContent = '🗑️';
        target.parentNode?.appendChild(fallback);
      }}
    />
  </div>
</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table Footer */}
                <div className="table-footer">
                  <div className="pagination-info">
                    Showing 1 - 10 out of 233
                  </div>
                  <div className="pagination-controls">
                    <button 
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    <button 
                      className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                    <button 
                      className={`pagination-btn ${currentPage === 2 ? 'active' : ''}`}
                      onClick={() => handlePageChange(2)}
                    >
                      2
                    </button>
                    <span className="pagination-ellipsis">...</span>
                    <button 
                      className={`pagination-btn ${currentPage === 9 ? 'active' : ''}`}
                      onClick={() => handlePageChange(9)}
                    >
                      9
                    </button>
                    <button 
                      className={`pagination-btn ${currentPage === 10 ? 'active' : ''}`}
                      onClick={() => handlePageChange(10)}
                    >
                      10
                    </button>
                    <button 
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;