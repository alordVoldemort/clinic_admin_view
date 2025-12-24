import React, { useState } from "react";
import { useEffect } from "react";
import "./Appointments.css";

const Appointments: React.FC = () => {
  const [checkedRows, setCheckedRows] = useState<number[]>([0, 2, 4]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [timeFilter, setTimeFilter] = useState<string>("Last Week");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    order: "asc" | "desc" | null;
  }>({
    column: "patient",
    order: null,
  });

  const totalPages = 10;

  // const appointments = [
  //   {
  //     patient: "Riya Patil",
  //     email: "riya.p@sumago.com",
  //     doctor: "Dr. Nitin Darda",
  //     date: "2024-12-06",
  //     time: "09:00 AM",
  //     type: "Spine Treatments",
  //     phone: "9867523490",
  //     status: "Confirmed",
  //   },
  //   {
  //     patient: "Rajesh Patil",
  //     email: "showtraders@yahoo.com",
  //     doctor: "Dr. Yogita Darda",
  //     date: "2024-12-06",
  //     time: "10:30 AM",
  //     type: "Spine Treatments",
  //     phone: "9012314567",
  //     status: "Pending",
  //   },
  //   {
  //     patient: "Rakesh Shetty",
  //     email: "guptasup@gmail.com",
  //     doctor: "Dr. Tanmay Darda",
  //     date: "2024-12-06",
  //     time: "11:00 AM",
  //     type: "Gynecology Treatment",
  //     phone: "9876543210",
  //     status: "Cancelled",
  //   },
  //   {
  //     patient: "Kiran More",
  //     email: "kmoretrans@gmail.com",
  //     doctor: "Dr. Nitin Darda",
  //     date: "2024-12-06",
  //     time: "02:00 PM",
  //     type: "Treatment Information",
  //     phone: "9867523490",
  //     status: "Confirmed",
  //   },
  //   {
  //     patient: "Sunita Shah",
  //     email: "sharmasteel@gmail.com",
  //     doctor: "Dr. Yogita Darda",
  //     date: "2024-12-06",
  //     time: "09:30 AM",
  //     type: "Kidney Treatment",
  //     phone: "9876543210",
  //     status: "Pending",
  //   },
  // ];

  // Status options for dropdown
  const [appointments, setAppointments] = useState<any[]>([]);

  const statusOptions = ["All Status", "Confirmed", "Pending", "Cancelled"];

  // Time filter options
  const timeOptions = ["Last Week", "Last Month", "Last Year"];

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

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  const handleTimeFilterChange = (option: string) => {
    setTimeFilter(option);
    setShowTimeDropdown(false);
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

  // Filter appointments based on search query and status filter
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.phone.includes(searchQuery) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort appointments based on sortConfig
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
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

  useEffect(() => {
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/appointments/admin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        
        const mappedData = Array.isArray(result.data)
  ? result.data.map((item: any) => ({
      patient: item.patient_name,
      email: item.patient_email,
      doctor: item.doctor_name,
      date: item.appointment_date,
      time: item.appointment_time,
      type: item.treatment_type,
      phone: item.patient_phone,
      status: item.status,
    }))
  : [];



        setAppointments(mappedData);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Appointments API error:", error);
    }
  };

  fetchAppointments();
}, []);


  return (
    <div className="appointments-container">
      <div className="main-content">
        <div className="appointments-content">
          {/* Header Section with Time Filter */}
          <div className="appointments-header-section">
            <div className="appointments-header">
              <div className="appointments-text">
                <h1 className="appointments-title">Appointments</h1>
                <p className="appointments-subtitle">
                  See your schedule patient appointments
                </p>
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
                        target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className = "calendar-icon-fallback";
                        fallback.textContent = "📅";
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
                        className={`time-filter-option ${
                          timeFilter === option ? "selected" : ""
                        }`}
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

          {/* Appointments Table Section */}
          <div className="appointments-table-section">
            <div className="table-section-header">
              {/* Filter Row */}
              <div className="filter-row">
                <div className="appointments-search-container">
                  <div className="appointments-search-icon-wrapper">
                    <img
                      src="/search.svg"
                      alt="Search"
                      className="appointments-search-svg-icon"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className =
                          "appointments-search-icon-fallback";
                        fallback.textContent = "🔍";
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
                        target.style.display = "none";
                        const fallback = document.createElement("span");
                        fallback.className = "filter-icon-fallback";
                        fallback.textContent = "⚙️";
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                    <select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="filter-select"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-horizontal-scroll-container">
              <div className="table-wrapper">
                <table className="appointments-full-table">
                  <thead>
                    <tr>
                      <th>
                        <div className="checkbox-header">
                          <div
                            className={`custom-checkbox ${
                              checkedRows.length === appointments.length
                                ? "checked"
                                : ""
                            }`}
                            onClick={handleSelectAll}
                          >
                            <span className="checkmark">✓</span>
                          </div>
                        </div>
                      </th>
                      {/* Patient Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("patient")}
                        >
                          <span className="header-text">Patient</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "patient" &&
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
                                sortConfig.column === "patient" &&
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
                      {/* Doctor Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("doctor")}
                        >
                          <span className="header-text">Doctor</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "doctor" &&
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
                                sortConfig.column === "doctor" &&
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
                      {/* Date Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("date")}
                        >
                          <span className="header-text">Date</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "date" &&
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
                                sortConfig.column === "date" &&
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
                      {/* Time Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("time")}
                        >
                          <span className="header-text">Time</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "time" &&
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
                                sortConfig.column === "time" &&
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
                      {/* Type Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("type")}
                        >
                          <span className="header-text">Type</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "type" &&
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
                                sortConfig.column === "type" &&
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
                      {/* Phone Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("phone")}
                        >
                          <span className="header-text">Phone</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "phone" &&
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
                                sortConfig.column === "phone" &&
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
                      {/* Status Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("status")}
                        >
                          <span className="header-text">Status</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "status" &&
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
                                sortConfig.column === "status" &&
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
                      <th>Active</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    {sortedAppointments.map(
                      (
                        appointment,
                        index // Change filteredAppointments to sortedAppointments
                      ) => (
                        <tr key={index}>
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
                            <div className="patient-info">
                              <div className="patient-name">
                                {appointment.patient}
                              </div>
                              <div className="patient-email">
                                {appointment.email}
                              </div>
                            </div>
                          </td>
                          <td>{appointment.doctor}</td>
                          <td>{appointment.date}</td>
                          <td>{appointment.time}</td>
                          <td>{appointment.type}</td>
                          <td>{appointment.phone}</td>
                          <td>
                            <span
                              className={`status-badge status-${appointment.status.toLowerCase()}`}
                            >
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
                                  console.log("Delete appointment", index);
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const fallback =
                                    document.createElement("span");
                                  fallback.className = "delete-action-fallback";
                                  fallback.textContent = "🗑️";
                                  target.parentNode?.appendChild(fallback);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody> */}
                  <tbody>
  {appointments.length === 0 ? (
    <tr>
      <td colSpan={6} style={{ textAlign: "center" }}>
        No appointments found
      </td>
    </tr>
  ) : (
    appointments.map((item, index) => (
      <tr key={item.id || index}>
        <td>{item.patient}</td>
        <td>{item.email}</td>
        <td>{item.phone}</td>
        <td>{item.service}</td>
        <td>{item.date}</td>
        <td>{item.status}</td>
      </tr>
    ))
  )}
</tbody>

                </table>
              </div>
            </div>

            {/* Table Footer */}
            <div className="table-footer">
              <div className="pagination-info">Showing 1 - 10 out of 233</div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <button
                  className={`pagination-btn ${
                    currentPage === 1 ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                <button
                  className={`pagination-btn ${
                    currentPage === 2 ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(2)}
                >
                  2
                </button>
                <span className="pagination-ellipsis">...</span>
                <button
                  className={`pagination-btn ${
                    currentPage === 9 ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(9)}
                >
                  9
                </button>
                <button
                  className={`pagination-btn ${
                    currentPage === 10 ? "active" : ""
                  }`}
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
  );
};

export default Appointments;
