import React, { useState } from 'react';
import './ContactMessage.css';

// Import SVG icons from assets
import UserIcon from "../../assets/Appointment/fullName.svg";
import EmailIcon from "../../assets/Appointment/email.svg";
import PhoneIcon from "../../assets/Appointment/Phone-number.svg";
import SubjectIcon from "../../assets/Appointment/treatment.svg"; 
import MessageIcon from "../../assets/Appointment/notes.svg";
import TimeIcon from "../../assets/Appointment/time.svg";
import DateIcon from "../../assets/Appointment/calendar.svg";

const ContactMessage: React.FC = () => {
  const [checkedRows, setCheckedRows] = useState<number[]>([0, 2, 4]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('Last Week'); 
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const totalPages = 10;

  const messages = [
    { 
      id: 1,
      patient: 'Riya Patil',
      email: 'riya.p@gmail.com',
      date: '2024-12-08',
      time: '09:00 AM',
      subject: 'General Inquiry',
      phone: '+91 9867523490',
      message: 'Any specific concerns or questions you\'d like to discuss. I have been experiencing back pain for the last two weeks.'
    },
    { 
      id: 2,
      patient: 'Rajesh Patil',
      email: 'rajeshpatil@gmail.com',
      date: '2024-12-06',
      time: '10:30 AM',
      subject: 'Appointment Inquiry',
      phone: '+91 9012314567',
      message: 'Any specific concerns or questions you\'d like to discuss. Need to reschedule my appointment.'
    },
    { 
      id: 3,
      patient: 'Rakesh Shetty',
      email: 'rakeshshetty@gmail.com',
      date: '2024-12-06',
      time: '11:00 AM',
      subject: 'Treatment Information',
      phone: '+91 9876543210',
      message: 'Any specific concerns or questions you\'d like to discuss. Want to know about the new treatment options.'
    },
    { 
      id: 4,
      patient: 'Kiran More',
      email: 'kiranmore@gmail.com',
      date: '2024-12-06',
      time: '02:00 PM',
      subject: 'Other',
      phone: '+91 9867523490',
      message: 'Any specific concerns or questions you\'d like to discuss. Need prescription refill.'
    },
    { 
      id: 5,
      patient: 'Sunita Shah',
      email: 'sunita.shah@gmail.com',
      date: '2024-12-06',
      time: '09:30 AM',
      subject: 'General Inquiry',
      phone: '+91 9876543210',
      message: 'Any specific concerns or questions you\'d like to discuss. Follow up on previous consultation.'
    },
    { 
      id: 6,
      patient: 'Riya Patil',
      email: 'riya.p@gmail.com',
      date: '2024-12-07',
      time: '10:00 AM',
      subject: 'General Inquiry',
      phone: '+91 9867523490',
      message: 'Any specific concerns or questions you\'d like to discuss. Need lab test results.'
    },
    { 
      id: 7,
      patient: 'Rajesh Patil',
      email: 'rajeshpatil@gmail.com',
      date: '2024-12-07',
      time: '11:30 AM',
      subject: 'Appointment Inquiry',
      phone: '+91 9012314567',
      message: 'Any specific concerns or questions you\'d like to discuss. Emergency appointment request.'
    },
    { 
      id: 8,
      patient: 'Rakesh Shetty',
      email: 'rakeshshetty@gmail.com',
      date: '2024-12-07',
      time: '02:00 PM',
      subject: 'Treatment Information',
      phone: '+91 9876543210',
      message: 'Any specific concerns or questions you\'d like to discuss. Second opinion request.'
    },
    { 
      id: 9,
      patient: 'Kiran More',
      email: 'kiranmore@gmail.com',
      date: '2024-12-08',
      time: '09:00 AM',
      subject: 'Other',
      phone: '+91 9867523490',
      message: 'Any specific concerns or questions you\'d like to discuss. Billing inquiry.'
    },
    { 
      id: 10,
      patient: 'Sunita Shah',
      email: 'sunita.shah@gmail.com',
      date: '2024-12-08',
      time: '10:30 AM',
      subject: 'General Inquiry',
      phone: '+91 9876543210',
      message: 'Any specific concerns or questions you\'d like to discuss. Medication side effects.'
    }
  ];

  // Time filter options
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
    if (checkedRows.length === messages.length) {
      setCheckedRows([]);
    } else {
      setCheckedRows(messages.map((_, index) => index));
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

  const handleTimeFilterChange = (option: string) => {
    setTimeFilter(option);
    setShowTimeDropdown(false);
  };

  const handleViewDetails = (message: any) => {
    setSelectedMessage(message);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: number) => {
    // Add your delete logic here
    console.log('Delete message with id:', id);
    alert(`Message ${id} deleted!`);
    // You would typically update state or make API call here
  };

  // Filter messages based on search query and time filter
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.phone.includes(searchQuery) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="contact-message-container">
  
      <div className="main-content">
        
        <div className="contact-message-content">
          
          {/* Header Section */}
          <div className="contact-header-section">
            <div className="contact-header">
              <div className="contact-text">
                <h1 className="contact-title">Contact Message</h1>
                <p className="contact-subtitle">Manage and schedule patient appointments</p>
              </div>
            </div>
          </div>

          {/* Contact Table Section - Always visible */}
          <div className="contact-table-section">
            <div className="table-section-header">
              
              {/* Filter Row - Search and Time Filter side by side */}
              <div className="filter-row">
                <div className="contact-search-container">
                  <div className="contact-search-icon-wrapper">
                    <img 
                      src="/search.svg" 
                      alt="Search"
                      className="contact-search-svg-icon"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'contact-search-icon-fallback';
                        fallback.textContent = '🔍';
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search"
                    className="contact-search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                
                {/* Time Filter Button with Calendar Icon - Right side of search */}
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

            <div className="table-horizontal-scroll-container">
              <div className="table-wrapper">
                <table className="contact-full-table">
                  <thead>
                    <tr>
                      <th>
                        <div className="checkbox-header">
                          <div 
                            className={`custom-checkbox ${checkedRows.length === messages.length ? 'checked' : ''}`}
                            onClick={handleSelectAll}
                          >
                            <span className="checkmark">✓</span>
                          </div>
                        </div>
                      </th>
                      <th>Patient</th>
                      <th>Email Address</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Subject</th>
                      <th>Phone</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((message, index) => (
                      <tr key={message.id} className="table-row">
                        <td className="table-cell">
                          <div className="checkbox-cell">
                            <div 
                              className={`custom-checkbox ${checkedRows.includes(index) ? 'checked' : ''}`}
                              onClick={() => handleCheckboxChange(index)}
                            >
                              <span className="checkmark">✓</span>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell patient-cell">
                          <div className="patient-info">
                            <div className="patient-name">{message.patient}</div>
                          </div>
                        </td>
                        <td className="table-cell email-cell">{message.email}</td>
                        <td className="table-cell date-cell">{message.date}</td>
                        <td className="table-cell time-cell">{message.time}</td>
                        <td className="table-cell subject-cell">
                          <span className="subject-badge">
                            {message.subject}
                          </span>
                        </td>
                        <td className="table-cell phone-cell">{message.phone}</td>
                        <td className="table-cell message-cell">
                          <div className="message-preview">
                            {message.message.length > 50 
                              ? `${message.message.substring(0, 50)}...` 
                              : message.message}
                          </div>
                        </td>
                        <td className="table-cell actions-cell">
                          <div className="contact-actions-container">
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteMessage(message.id)}
                              title="Delete"
                            >
                              <img 
                                src="/delete.svg" 
                                alt="Delete"
                                className="delete-icon"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = 'delete-icon-fallback';
                                  fallback.textContent = '🗑️';
                                  target.parentNode?.appendChild(fallback);
                                }}
                              />
                            </button>
                            <button 
                              className="view-btn"
                              onClick={() => handleViewDetails(message)}
                              title="View Details"
                            >
                              <img 
                                src="/eye-icon.svg" 
                                alt="View"
                                className="view-icon"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = 'view-icon-fallback';
                                  fallback.textContent = '👁️';
                                  target.parentNode?.appendChild(fallback);
                                }}
                              />
                            </button>
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

          {/* Message Details Modal - Shows on top of table */}
          {showDetails && selectedMessage && (
            <>
            
              {/* Overlay */}
              <div className="message-modal-overlay" onClick={handleCloseDetails}></div>
              
               
              {/* Message Details Modal - Using same design as message-contact-table.png */}
              <div className="message-details-modal">
               
                <div className="message-details-card">
                  {/* Header with title and close button */}
                  <div className="message-details-subtitle">Message Details</div>
                  
                  <button className="modal-close-btn" onClick={handleCloseDetails}>
                    ✕
                  </button>

                  {/* Field Group Container with 22px gap */}
                  <div className="field-group-container">
                    
                    {/* Patient Name with A bullet - Exactly like in image */}
                    <div className="subject-section-modal">
                      <div className="field-label-with-icon">
                        <img src={UserIcon} alt="Patient Name" className="field-icon" />
                        <span className="field-label">Patient Name</span>
                      </div>
                      <div className="subject-value-modal">{selectedMessage.patient}</div>
                    </div>
                    
                    {/* Email and Phone - Same row like in image */}
                    <div className="contact-info-row">
                      <div className="contact-field-with-icon">
                        <div className="field-label-with-icon">
                          <img src={EmailIcon} alt="Email" className="field-icon" />
                          <span className="field-label">Email Address</span>
                        </div>
                        <div className="field-value email-value">{selectedMessage.email}</div>
                      </div>
                      <div className="contact-field-with-icon">
                        <div className="field-label-with-icon">
                          <img src={PhoneIcon} alt="Phone" className="field-icon" />
                          <span className="field-label">Phone Number</span>
                        </div>
                        <div className="field-value phone-value">{selectedMessage.phone}</div>
                      </div>
                    </div>
                    
                    {/* Date and Time - Same row like in image */}
                    <div className="datetime-row">
                      <div className="datetime-field">
                        <div className="field-label-with-icon">
                          <img src={DateIcon} alt="Date" className="field-icon" />
                          <span className="field-label">Date</span>
                        </div>
                        <div className="field-value">{selectedMessage.date}</div>
                      </div>
                      <div className="datetime-field">
                        <div className="field-label-with-icon">
                          <img src={TimeIcon} alt="Time" className="field-icon" />
                          <span className="field-label">Time</span>
                        </div>
                        <div className="field-value">{selectedMessage.time}</div>
                      </div>
                    </div>
                    
                    {/* Subject Section */}
                    <div className="subject-section-modal">
                      <div className="field-label-with-icon">
                        <img src={SubjectIcon} alt="Subject" className="field-icon" />
                        <span className="field-label">Subject</span>
                      </div>
                      <div className="subject-value-modal">{selectedMessage.subject}</div>
                    </div>
                    
                    {/* Message Section */}
                    <div className="message-section-modal">
                      <div className="field-label-with-icon">
                        <img src={MessageIcon} alt="Message" className="field-icon" />
                        <span className="field-label">Message</span>
                      </div>
                      <div className="message-value-modal">
                        {selectedMessage.message}
                      </div>
                    </div>
                    
                  </div>
                  
                  {/* Delete Button */}
                  <div className="modal-actions">
                    <button 
                      className="delete-message-btn"
                      onClick={() => {
                        handleDeleteMessage(selectedMessage.id);
                        handleCloseDetails();
                      }}
                    >
                      Delete Message
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessage;