import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllAppointments, deleteAppointment } from "../../apis/appointments";
import dropdownIcon from "../../assets/Dropdownicon/angle-small-down (6) 1.svg";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import "./Appointments.css";

const Appointments: React.FC = () => {
  const [checkedRows, setCheckedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [customDate, setCustomDate] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    order: "asc" | "desc" | null;
  }>({
    column: "patient",
    order: null,
  });

  const [appointments, setAppointments] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    type: "single" | "multiple";
    id?: string;
    count?: number;
  } | null>(null);
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
  const statusOptions = ["All Status", "Tentative", "Confirmed"];

  // Date filter options
  const dateFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this_week", label: "This Week" },
    { value: "last_week", label: "Last Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "this_year", label: "This Year" },
  ];

  const handleCheckboxChange = (id: string) => {
    setCheckedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    setDeleteModalConfig({ type: "single", id });
    setShowDeleteModal(true);
  };

  const confirmDeleteAppointment = async () => {
    if (!deleteModalConfig || deleteModalConfig.type !== "single" || !deleteModalConfig.id) {
      return;
    }

    const { id } = deleteModalConfig;
    setShowDeleteModal(false);
    setDeleteModalConfig(null);

    try {
      const result = await deleteAppointment(id);
      if (result.success) {
        // Remove from local state immediately
        setAppointments((prev) => prev.filter((app) => app.id !== id));
        // Remove from checked rows if present
        setCheckedRows((prev) => prev.filter((checkedId) => checkedId !== id));
        // Update total count
        setTotalAppointments((prev) => Math.max(0, prev - 1));
        toast.success("Appointment deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete appointment");
      }
    } catch (error: any) {
      console.error("Delete appointment error:", error);
      toast.error(error.message || "Failed to delete appointment");
    }
  };

  const handleDeleteSelected = async () => {
    if (checkedRows.length === 0) {
      toast.warning("Please select at least one appointment to delete");
      return;
    }

    setDeleteModalConfig({ type: "multiple", count: checkedRows.length });
    setShowDeleteModal(true);
  };

  const confirmDeleteSelected = async () => {
    if (!deleteModalConfig || deleteModalConfig.type !== "multiple" || !deleteModalConfig.count) {
      return;
    }

    setShowDeleteModal(false);
    const count = deleteModalConfig.count;
    setDeleteModalConfig(null);

    setIsLoading(true);
    const selectedAppointmentIds = checkedRows.filter((id) => id !== undefined);

    if (selectedAppointmentIds.length === 0) {
      toast.error("No valid appointments selected");
      setIsLoading(false);
      return;
    }

    try {
      // Delete all selected appointments in parallel
      const deletePromises = selectedAppointmentIds.map((id) =>
        deleteAppointment(id)
      );
      const results = await Promise.all(deletePromises);

      // Check if all deletions were successful
      const allSuccess = results.every((result) => result.success);
      const failedCount = results.filter((result) => !result.success).length;

      if (allSuccess) {
        toast.success(
          `${selectedAppointmentIds.length} appointment(s) deleted successfully!`
        );
        // Clear checked rows
        setCheckedRows([]);
        // Refresh appointments list
        const dateFilterParams: any = {
          date_filter: dateFilter,
        };

        if (dateFilter === "custom_date" && customDate) {
          dateFilterParams.date = customDate;
        } else if (dateFilter === "custom_range" && fromDate && toDate) {
          dateFilterParams.from_date = fromDate;
          dateFilterParams.to_date = toDate;
        }

        const appointmentsResult = await getAllAppointments({
          page: currentPage,
          limit: 20,
          status: statusFilter !== "All Status" ? statusFilter : undefined,
          search: searchQuery || undefined,
          ...dateFilterParams,
        });

        if (
          appointmentsResult.success &&
          appointmentsResult.data?.appointments
        ) {
          setAppointments(appointmentsResult.data.appointments);
          if (appointmentsResult.data.pagination) {
            setTotalPages(appointmentsResult.data.pagination.totalPages || 1);
            setTotalAppointments(
              appointmentsResult.data.pagination.total || 0
            );
          }
        }
      } else {
        toast.error(
          `Failed to delete ${failedCount} appointment(s). Please try again.`
        );
        // Still refresh the list to show current state
        const dateFilterParams: any = {
          date_filter: dateFilter,
        };

        if (dateFilter === "custom_date" && customDate) {
          dateFilterParams.date = customDate;
        } else if (dateFilter === "custom_range" && fromDate && toDate) {
          dateFilterParams.from_date = fromDate;
          dateFilterParams.to_date = toDate;
        }

        const appointmentsResult = await getAllAppointments({
          page: currentPage,
          limit: 20,
          status: statusFilter !== "All Status" ? statusFilter : undefined,
          search: searchQuery || undefined,
          ...dateFilterParams,
        });

        if (
          appointmentsResult.success &&
          appointmentsResult.data?.appointments
        ) {
          setAppointments(appointmentsResult.data.appointments);
          if (appointmentsResult.data.pagination) {
            setTotalPages(appointmentsResult.data.pagination.totalPages || 1);
            setTotalAppointments(
              appointmentsResult.data.pagination.total || 0
            );
          }
        }
      }
    } catch (error: any) {
      console.error("Delete selected appointments error:", error);
      toast.error(error.message || "Failed to delete appointments");
    } finally {
      setIsLoading(false);
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

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setShowDateDropdown(false);
    // Reset custom date inputs when filter changes
    if (value !== "custom_date") {
      setCustomDate("");
    }
    if (value !== "custom_range") {
      setFromDate("");
      setToDate("");
    }
    // Reset to first page when filter changes
    setCurrentPage(1);
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
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (appointment.patient?.toLowerCase() || "").includes(searchLower) ||
      (appointment.email?.toLowerCase() || "").includes(searchLower) ||
      (appointment.doctor?.toLowerCase() || "").includes(searchLower) ||
      (appointment.phone || "").includes(searchQuery) ||
      (appointment.type?.toLowerCase() || "").includes(searchLower);

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

  const handleSelectAll = () => {
    if (checkedRows.length === sortedAppointments.length && sortedAppointments.length > 0) {
      setCheckedRows([]);
    } else {
      setCheckedRows(sortedAppointments.map((app) => app.id));
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const status =
          statusFilter !== "All Status" ? statusFilter.toLowerCase() : "";

        // Build date filter params
        const dateFilterParams: any = {
          date_filter: dateFilter,
        };

        if (dateFilter === "custom_date" && customDate) {
          dateFilterParams.date = customDate;
        } else if (dateFilter === "custom_range" && fromDate && toDate) {
          dateFilterParams.from_date = fromDate;
          dateFilterParams.to_date = toDate;
        }

        const result = await getAllAppointments({
          page: currentPage,
          limit: 20,
          status: status,
          search: searchQuery,
          sort_by: "date",
          sort_order: "DESC",
          ...dateFilterParams,
        });

        if (result.success && result.data) {
          // Map API response to frontend format
          const mappedData = Array.isArray(result.data.appointments)
            ? result.data.appointments.map((item: any) => ({
                id: item.id,
                patient: item.name,
                email: item.email,
                doctor: "Dr. Nitin Darda", // Default doctor name (can be updated if API provides it)
                date: item.date,
                time: item.time,
                type: item.service,
                phone: item.phone,
                status: item.status
                  ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                  : "Pending",
                notes: item.notes || "",
                amount: item.amount || "0.00",
                is_paid: item.is_paid || 0,
              }))
            : [];

          setAppointments(mappedData);

          // Update pagination
          if (result.data.pagination) {
            setTotalPages(result.data.pagination.totalPages || 1);
            setTotalAppointments(result.data.pagination.total || 0);
          }
        } else {
          console.error("Failed to fetch appointments:", result.message);
        }
      } catch (error: any) {
        console.error("Appointments API error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [
    currentPage,
    statusFilter,
    searchQuery,
    dateFilter,
    customDate,
    fromDate,
    toDate,
  ]);

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
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
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
                    <span className="time-filter-text">
                      {dateFilterOptions.find((opt) => opt.value === dateFilter)
                        ?.label || "Today"}
                    </span>
                    <img 
                      src={dropdownIcon} 
                      alt="Dropdown" 
                      className="dropdown-arrow"
                    />
                  </div>
                </button>
                {showDateDropdown && (
                  <div className="time-filter-dropdown">
                    {dateFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`time-filter-option ${
                          dateFilter === option.value ? "selected" : ""
                        }`}
                        onClick={() => handleDateFilterChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Custom Date Input */}
              {dateFilter === "custom_date" && (
                <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      fontSize: "14px",
                    }}
                  />
                </div>
              )}
              {/* Custom Range Inputs */}
              {dateFilter === "custom_range" && (
                <div
                  style={{
                    marginTop: "10px",
                    marginLeft: "20px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "4px",
                        fontSize: "12px",
                      }}
                    >
                      From:
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => {
                        const newFromDate = e.target.value;
                        setFromDate(newFromDate);
                        // Validate: from_date should not be greater than to_date
                        if (toDate && newFromDate > toDate) {
                          toast.error(
                            "From date cannot be greater than To date"
                          );
                        }
                      }}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "4px",
                        fontSize: "12px",
                      }}
                    >
                      To:
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => {
                        const newToDate = e.target.value;
                        setToDate(newToDate);
                        // Validate: to_date should not be less than from_date
                        if (fromDate && newToDate < fromDate) {
                          toast.error("To date cannot be less than From date");
                        }
                      }}
                      min={fromDate || undefined}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>
              )}
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

                <div className="status-actions">
                  {checkedRows.length > 0 && (
                    <button
                      className="delete-selected-btn"
                      onClick={handleDeleteSelected}
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : `Delete (${checkedRows.length})`}
                    </button>
                  )}

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
                          fallback.textContent = "";
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
                              checkedRows.length === sortedAppointments.length && sortedAppointments.length > 0
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
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={9}
                          style={{ textAlign: "center", padding: "2rem" }}
                        >
                          Loading appointments...
                        </td>
                      </tr>
                    ) : appointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          style={{ textAlign: "center", padding: "2rem" }}
                        >
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      sortedAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            <div className="checkbox-cell">
                              <div
                                className={`custom-checkbox ${
                                  checkedRows.includes(appointment.id) ? "checked" : ""
                                }`}
                                onClick={() => handleCheckboxChange(appointment.id)}
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
                              className={`status-badge status-${appointment.status?.toLowerCase() || ""}`}
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
                                  if (appointment.id) {
                                    handleDeleteAppointment(appointment.id);
                                  }
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Footer */}
            <div className="table-footer">
              <div className="pagination-info">
                Showing{" "}
                {appointments.length > 0 ? (currentPage - 1) * 20 + 1 : 0} -{" "}
                {Math.min(currentPage * 20, totalAppointments)} out of{" "}
                {totalAppointments}
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
                    pageNum = currentPage - 4 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${
                        currentPage === pageNum ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
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
                    disabled={isLoading}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title={
          deleteModalConfig?.type === "single"
            ? "Delete Appointment"
            : "Delete Appointments"
        }
        message={
          deleteModalConfig?.type === "single"
            ? "Are you sure you want to delete this appointment? This action cannot be undone."
            : `Are you sure you want to delete ${deleteModalConfig?.count || 0} appointment(s)? This action cannot be undone.`
        }
        onConfirm={() => {
          if (deleteModalConfig?.type === "single") {
            confirmDeleteAppointment();
          } else {
            confirmDeleteSelected();
          }
        }}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteModalConfig(null);
        }}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Appointments;
