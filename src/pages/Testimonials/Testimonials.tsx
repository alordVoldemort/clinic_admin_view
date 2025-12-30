import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./Testimonials.css";
import {
  getAllTestimonials,
  createTestimonial,
  deleteTestimonial,
} from "../../apis/testimonials";

const Testimonials: React.FC = () => {
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTestimonials, setTotalTestimonials] = useState(0);
  const [newTestimonial, setNewTestimonial] = useState({
    firstName: "",
    lastName: "",
    feedback: "",
    photo: null as File | null,
  });
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    order: "asc" | "desc" | null;
  }>({
    column: "clientName",
    order: null,
  });

  // Fetch testimonials on component mount and when page/search changes
  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, searchQuery]);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const result = await getAllTestimonials({
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined,
      });

      if (result.success && result.data) {
        // Map backend data to frontend format
        const mappedTestimonials = result.data.testimonials.map((item: any) => ({
          id: item.id,
          clientName: `${item.first_name} ${item.last_name}`,
          firstName: item.first_name,
          lastName: item.last_name,
          feedback: item.feedback,
          photo: item.image_url || null,
          createdAt: item.createdAt,
        }));

        setTestimonials(mappedTestimonials);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalTestimonials(result.data.pagination?.total || 0);
      }
    } catch (error: any) {
      console.error("Failed to fetch testimonials:", error);
      toast.error(error.message || "Failed to fetch testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedRows((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (checkedRows.length === testimonials.length && testimonials.length > 0) {
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
    // Reset to page 1 when search changes
    setCurrentPage(1);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTestimonial({
      firstName: "",
      lastName: "",
      feedback: "",
      photo: null,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTestimonial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTestimonial((prev) => ({
        ...prev,
        photo: e.target.files![0],
      }));
    }
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("first_name", newTestimonial.firstName.trim());
      formData.append("last_name", newTestimonial.lastName.trim());
      formData.append("feedback", newTestimonial.feedback.trim());
      
      if (newTestimonial.photo) {
        formData.append("image", newTestimonial.photo);
      }

      const result = await createTestimonial(formData);

      if (result.success) {
        toast.success("Testimonial added successfully!");
        handleCloseAddModal();
        // Refresh testimonials list
        fetchTestimonials();
      } else {
        toast.error(result.message || "Failed to add testimonial");
      }
    } catch (error: any) {
      console.error("Failed to create testimonial:", error);
      toast.error(error.message || "Failed to add testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const result = await deleteTestimonial(id);
      if (result.success) {
        toast.success("Testimonial deleted successfully!");
        // Refresh testimonials list
        fetchTestimonials();
        // Clear checked rows if deleted item was checked
        setCheckedRows([]);
      } else {
        toast.error(result.message || "Failed to delete testimonial");
      }
    } catch (error: any) {
      console.error("Failed to delete testimonial:", error);
      toast.error(error.message || "Failed to delete testimonial");
    }
  };

  const handleSort = (column: string) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        // If clicking same column, cycle through asc → desc → null
        if (prev.order === "asc") return { column, order: "desc" };
        if (prev.order === "desc") return { column, order: null };
        return { column, order: "asc" };
      } else {
        // New column, start with asc
        return { column, order: "asc" };
      }
    });
  };

  // Sort testimonials based on sortConfig (client-side sorting)
  const sortedTestimonials = [...testimonials].sort((a, b) => {
    if (!sortConfig.order) return 0;

    const aValue = a[sortConfig.column as keyof typeof a];
    const bValue = b[sortConfig.column as keyof typeof b];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return (
    <div className="testimonials-container">
      <div className="main-content">
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
                        target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className =
                          "testimonials-search-icon-fallback";
                        fallback.textContent = "🔍";
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

                <button
                  className="add-testimonial-btn-inline"
                  onClick={handleOpenAddModal}
                >
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
                            className={`custom-checkbox ${
                              checkedRows.length === testimonials.length
                                ? "checked"
                                : ""
                            }`}
                            onClick={handleSelectAll}
                          >
                            <span className="checkmark">✓</span>
                          </div>
                        </div>
                      </th>
                      {/* Client Name Column Header - Updated with sorting */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("clientName")}
                        >
                          <span className="header-text">Client Name</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "clientName" &&
                                sortConfig.order === "asc"
                                  ? "active"
                                  : ""
                              }`}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const fallback = document.createElement("span");
                                fallback.textContent = "↑";
                                target.parentNode?.appendChild(fallback);
                              }}
                            />
                            <img
                              src="./sort-desc.svg"
                              alt="Desc"
                              className={`sort-icon ${
                                sortConfig.column === "clientName" &&
                                sortConfig.order === "desc"
                                  ? "active"
                                  : ""
                              }`}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const fallback = document.createElement("span");
                                fallback.textContent = "↓";
                                target.parentNode?.appendChild(fallback);
                              }}
                            />
                          </span>
                        </div>
                      </th>
                      <th>Client feedback</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                          Loading testimonials...
                        </td>
                      </tr>
                    ) : sortedTestimonials.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                          No testimonials found
                        </td>
                      </tr>
                    ) : (
                      sortedTestimonials.map((testimonial, index) => {
                        // Get base URL for image
                        const BASE_URL =
                          process.env.REACT_APP_BASE_URL ||
                          "https://nirmalhealthcare.co.in";
                        const imageUrl = testimonial.photo
                          ? testimonial.photo.startsWith("http")
                            ? testimonial.photo
                            : `${BASE_URL}${testimonial.photo}`
                          : null;

                        return (
                          <tr key={testimonial.id}>
                            <td>
                              <div className="checkbox-cell">
                                <div
                                  className={`custom-checkbox ${
                                    checkedRows.includes(index) ? "checked" : ""
                                  }`}
                                  onClick={() => handleCheckboxChange(index)}
                                >
                                  <span className="checkmark">✓</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="client-info">
                                <div className="client-avatar">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={testimonial.clientName}
                                      className="client-photo"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        const fallback =
                                          document.createElement("div");
                                        fallback.className =
                                          "client-photo-fallback";
                                        fallback.textContent =
                                          testimonial.clientName.charAt(0);
                                        target.parentNode?.appendChild(fallback);
                                      }}
                                    />
                                  ) : (
                                    <div className="client-photo-fallback">
                                      {testimonial.clientName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="client-name">
                                  {testimonial.clientName}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="feedback-text">
                                "{testimonial.feedback}"
                              </div>
                            </td>
                            <td>
                              <div className="testimonial-actions-container">
                                <button
                                  className="delete-btn"
                                  title="Delete"
                                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                                >
                                  <img
                                    src="/delete.svg"
                                    alt="Delete"
                                    className="delete-icon"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = "none";
                                      const fallback =
                                        document.createElement("span");
                                      fallback.className = "delete-icon-fallback";
                                      fallback.textContent = "🗑️";
                                      target.parentNode?.appendChild(fallback);
                                    }}
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Footer */}
            <div className="table-footer">
              <div className="pagination-info">
                Showing{" "}
                {totalTestimonials > 0
                  ? (currentPage - 1) * 20 + 1
                  : 0}{" "}
                - {Math.min(currentPage * 20, totalTestimonials)} out of{" "}
                {totalTestimonials}
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  ← Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 10) {
                    pageNum = i + 1;
                  } else if (currentPage <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 4) {
                    pageNum = totalPages - 9 + i;
                  } else {
                    pageNum = currentPage - 5 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${
                        currentPage === pageNum ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 10 && currentPage < totalPages - 4 && (
                  <span className="pagination-ellipsis">...</span>
                )}
                {totalPages > 10 && currentPage < totalPages - 4 && (
                  <button
                    className={`pagination-btn ${
                      currentPage === totalPages ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
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
                      <div className="file-name">
                        {newTestimonial.photo.name}
                      </div>
                    )}

                    {/* ✅ ADD THIS BELOW */}
    <div className="upload-guidelines">
      Supported formats: JPG, JPEG, PNG, WEBP<br />
      Maximum file size: 2 MB
    </div>
 
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
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseAddModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Testimonials"}
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
