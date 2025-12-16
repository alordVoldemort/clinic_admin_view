import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  const [checkedRows, setCheckedRows] = useState<number[]>([0, 2, 4]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    firstName: '',
    lastName: '',
    feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
    photo: null as File | null
  });
  
  const totalPages = 10;

  const testimonials = [
    { 
      id: 1,
      clientName: 'Riya Patil',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user1.jpg'
    },
    { 
      id: 2,
      clientName: 'Rajesh Patil',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user2.jpg'
    },
    { 
      id: 3,
      clientName: 'Rakesh Shetty',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user3.jpg'
    },
    { 
      id: 4,
      clientName: 'Kiran More',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user4.jpg'
    },
    { 
      id: 5,
      clientName: 'Sunita Shah',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user5.jpg'
    },
    { 
      id: 6,
      clientName: 'Riya Patil',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user1.jpg'
    },
    { 
      id: 7,
      clientName: 'Rajesh Patil',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user2.jpg'
    },
    { 
      id: 8,
      clientName: 'Rakesh Shetty',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user3.jpg'
    },
    { 
      id: 9,
      clientName: 'Kiran More',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user4.jpg'
    },
    { 
      id: 10,
      clientName: 'Sunita Shah',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: '/user5.jpg'
    }
  ];

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
    if (checkedRows.length === testimonials.length) {
      setCheckedRows([]);
    } else {
      setCheckedRows(testimonials.map((_, index) => index));
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

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTestimonial({
      firstName: '',
      lastName: '',
      feedback: 'The care I received was exceptional. My chronic back pain has significantly improved after treatment. Highly recommended!',
      photo: null
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTestimonial(prev => ({
        ...prev,
        photo: e.target.files![0]
      }));
    }
  };

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New testimonial:', newTestimonial);
    // Here you would typically send the data to your backend
    handleCloseAddModal();
  };

  // Filter testimonials based on search query
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = 
      testimonial.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.feedback.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="testimonials-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="testimonials-content">
          
          {/* Header Section */}
          <div className="testimonials-header-section">
            <div className="testimonials-header">
              <div className="testimonials-text">
                <h1 className="testimonials-title">Testimonial</h1>
                <p className="testimonials-subtitle">Client Testimonials</p>
              </div>
            </div>
          </div>

          {/* Testimonials Table Section */}
          <div className="testimonials-table-section">
            <div className="table-section-header">
              
              {/* Filter Row */}
              <div className="filter-row">
                <div className="testimonials-search-container">
                  <div className="testimonials-search-icon-wrapper">
                    <img 
                      src="/search.svg" 
                      alt="Search"
                      className="testimonials-search-svg-icon"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'testimonials-search-icon-fallback';
                        fallback.textContent = '🔍';
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search"
                    className="testimonials-search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <button className="add-testimonial-btn-inline" onClick={handleOpenAddModal}>
                  Add Testimonial
                </button>
              </div>
            </div>

            <div className="table-horizontal-scroll-container">
              <div className="table-wrapper">
                <table className="testimonials-full-table">
                  <thead>
                    <tr>
                      <th>
                        <div className="checkbox-header">
                          <div 
                            className={`custom-checkbox ${checkedRows.length === testimonials.length ? 'checked' : ''}`}
                            onClick={handleSelectAll}
                          >
                            <span className="checkmark">✓</span>
                          </div>
                        </div>
                      </th>
                      <th>Client Name</th>
                      <th>Client feedback</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTestimonials.map((testimonial, index) => (
                      <tr key={testimonial.id}>
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
                          <div className="client-info">
                            <div className="client-avatar">
                              {testimonial.photo ? (
                                <img 
                                  src={testimonial.photo} 
                                  alt={testimonial.clientName}
                                  className="client-photo"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = 'client-photo-fallback';
                                    fallback.textContent = testimonial.clientName.charAt(0);
                                    target.parentNode?.appendChild(fallback);
                                  }}
                                />
                              ) : (
                                <div className="client-photo-fallback">
                                  {testimonial.clientName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="client-name">{testimonial.clientName}</div>
                          </div>
                        </td>
                        <td>
                          <div className="feedback-text">
                            "{testimonial.feedback}"
                          </div>
                        </td>
                        <td>
                          <div className="testimonial-actions-container">
                            <button className="delete-btn" title="Delete">
                              <img 
                                src="/delete.svg" 
                                alt="Delete"
                                className="delete-icon"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = document.createElement('span');
                                  fallback.className = 'delete-icon-fallback';
                                  fallback.textContent = '🗑️';
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
        </div>
      </div>

      {/* Add Testimonial Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-testimonial-modal">
            <div className="modal-header">
              <h2 className="modal-title">Add Testimonial</h2>
              <button className="close-modal-btn" onClick={handleCloseAddModal}>
                ✕
              </button>
            </div>
            
            <div className="modal-subtitle">Add Client Testimonials</div>
            
            <form onSubmit={handleSubmitTestimonial}>
              <div className="type-section">
                <div className="upload-label">Upload Photo</div>
                <div className="upload-photo-section">
                  <div className="upload-area">
                    <input
                      type="file"
                      id="photo-upload"
                      className="photo-upload-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="photo-upload" className="upload-btn">
                      <span className="upload-icon">+</span>
                      <span className="upload-text">Upload Photo</span>
                    </label>
                    {newTestimonial.photo && (
                      <div className="file-name">{newTestimonial.photo.name}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="name-section">
                <div className="name-label">Client Name</div>
                <div className="name-fields">
                  <div className="name-field">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter Your First Name"
                      className="name-input"
                      value={newTestimonial.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="name-field">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Your Last Name"
                      className="name-input"
                      value={newTestimonial.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="feedback-section">
                <div className="feedback-label">Client feedback</div>
                <textarea
                  name="feedback"
                  className="feedback-textarea"
                  value={newTestimonial.feedback}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseAddModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Testimonials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;