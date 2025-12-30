import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllContacts, getContactById, markAsRead, updateContactStatus, getUnreadCount, deleteContact } from "../../apis/contacts";
import { formatDateTimeIST } from "../../utils/dateUtils";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import "./ContactMessage.css";

// Import SVG icons from assets
import UserIcon from "../../assets/Appointment/fullName.svg";
import EmailIcon from "../../assets/Appointment/email.svg";
import PhoneIcon from "../../assets/Appointment/Phone-number.svg";
import SubjectIcon from "../../assets/Appointment/treatment.svg";
import MessageIcon from "../../assets/Appointment/notes.svg";
import TimeIcon from "../../assets/Appointment/time.svg";
import DateIcon from "../../assets/Appointment/calendar.svg";
import dropdownIcon from "../../assets/Dropdownicon/angle-small-down (6) 1.svg";

// Reusable mapper function to ensure consistent contact shape
const mapContacts = (contacts: any[]) => {
  return contacts.map((item: any) => {
    // Convert UTC timestamp to IST before formatting
    const { date: dateStr, time: timeStr } = formatDateTimeIST(item.createdAt);

    return {
      id: item.id,
      patient: item.name,
      email: item.email,
      phone: item.phone,
      subject: item.subject,
      message: item.message,
      date: dateStr,
      time: timeStr,
      status: item.status || 'unread',
      responded: item.responded || 0,
      createdAt: item.createdAt,
    };
  });
};

const ContactMessage: React.FC = () => {
  const [checkedRows, setCheckedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    type: "single" | "multiple";
    id?: string;
    count?: number;
  } | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    column: string;
    order: "asc" | "desc" | null;
  }>({
    column: "patient",
    order: null,
  });

  // Fetch contacts from API with debounced search
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const result = await getAllContacts({
          page: currentPage,
          limit: 20,
          search: searchQuery,
          date_filter: dateFilter || undefined,
          sort_by: 'createdAt',
          sort_order: 'DESC'
        });

        if (result.success && result.data) {
          // Map API response to frontend format using reusable mapper
          const mappedData = Array.isArray(result.data.contacts)
            ? mapContacts(result.data.contacts)
            : [];

          setMessages(mappedData);

          // Update pagination
          if (result.data.pagination) {
            setTotalPages(result.data.pagination.totalPages || 1);
            setTotalContacts(result.data.pagination.total || 0);
          }
        }
      } catch (error: any) {
        console.error("Contacts API error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchContacts();
    }, searchQuery ? 500 : 0); // 500ms delay for search, immediate for page changes

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchQuery, dateFilter]);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const result = await getUnreadCount();
        if (result.success && result.data) {
          setUnreadCount(result.data.unread_count || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const oldMessages = [
    {
      id: 1,
      patient: "Riya Patil",
      email: "riya.p@gmail.com",
      date: "06/12/2025",
      time: "09:00 AM",
      subject: "General Inquiry",
      phone: "+91 9867523490",
      message:
        "Add Any Special Interactions or note about this appointments ",
    },
    {
      id: 2,
      patient: "Rajesh Patil",
      email: "rajeshpatil@gmail.com",
      date: "06/12/2025",
      time: "10:30 AM",
      subject: "Appointment Inquiry",
      phone: "+91 9012314567",
      message:
        "Any specific concerns or questions you'd like to discuss. Need to reschedule my appointment.",
    },
    {
      id: 3,
      patient: "Rakesh Shetty",
      email: "rakeshshetty@gmail.com",
      date: "06/12/2025",
      time: "11:00 AM",
      subject: "Treatment Information",
      phone: "+91 9876543210",
      message:
        "Any specific concerns or questions you'd like to discuss. Want to know about the new treatment options.",
    },
    {
      id: 4,
      patient: "Kiran More",
      email: "kiranmore@gmail.com",
      date: "06/12/2025",
      time: "02:00 PM",
      subject: "Other",
      phone: "+91 9867523490",
      message:
        "Any specific concerns or questions you'd like to discuss. Need prescription refill.",
    },
    {
      id: 5,
      patient: "Sunita Shah",
      email: "sunita.shah@gmail.com",
      date: "06/12/2025",
      time: "09:30 AM",
      subject: "General Inquiry",
      phone: "+91 9876543210",
      message:
        "Any specific concerns or questions you'd like to discuss. Follow up on previous consultation.",
    },
    {
      id: 6,
      patient: "Riya Patil",
      email: "riya.p@gmail.com",
      date: "06/12/2025",
      time: "10:00 AM",
      subject: "General Inquiry",
      phone: "+91 9867523490",
      message:
        "Any specific concerns or questions you'd like to discuss. Need lab test results.",
    },
    {
      id: 7,
      patient: "Rajesh Patil",
      email: "rajeshpatil@gmail.com",
      date: "06/12/2025",
      time: "11:30 AM",
      subject: "Appointment Inquiry",
      phone: "+91 9012314567",
      message:
        "Any specific concerns or questions you'd like to discuss. Emergency appointment request.",
    },
    {
      id: 8,
      patient: "Rakesh Shetty",
      email: "rakeshshetty@gmail.com",
      date: "06/12/2025",
      time: "02:00 PM",
      subject: "Treatment Information",
      phone: "+91 9876543210",
      message:
        "Any specific concerns or questions you'd like to discuss. Second opinion request.",
    },
    {
      id: 9,
      patient: "Kiran More",
      email: "kiranmore@gmail.com",
      date: "08/12/2025",
      time: "09:00 AM",
      subject: "Other",
      phone: "+91 9867523490",
      message:
        "Any specific concerns or questions you'd like to discuss. Billing inquiry.",
    },
    {
      id: 10,
      patient: "Sunita Shah",
      email: "sunita.shah@gmail.com",
      date: "08/12/2025",
      time: "10:30 AM",
      subject: "General Inquiry",
      phone: "+91 9876543210",
      message:
        "Any specific concerns or questions you'd like to discuss. Medication side effects.",
    },
  ];

  // Date filter options with display labels
  const dateFilterOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this_month", label: "This Month" },
    { value: "this_year", label: "This Year" }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
  setCurrentPage(1);
};

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setShowDateDropdown(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleViewDetails = async (message: any) => {
    try {
      // Fetch full contact details from API
      const result = await getContactById(message.id);
      if (result.success && result.data) {
        const contact = result.data.contact;
        // Convert UTC timestamp to IST before formatting
        const { date: dateStr, time: timeStr } = formatDateTimeIST(contact.createdAt);

        const mappedContact = {
          id: contact.id,
          patient: contact.name,
          email: contact.email,
          phone: contact.phone,
          subject: contact.subject,
          message: contact.message,
          date: dateStr,
          time: timeStr,
          status: contact.status || 'unread',
          responded: contact.responded || 0,
        };

        setSelectedMessage(mappedContact);
        setShowDetails(true);

        // Mark as read if unread
        if (contact.status === 'unread') {
          try {
            await markAsRead(contact.id);
            // Update local state
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === contact.id ? { ...msg, status: 'read' } : msg
              )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
          } catch (error) {
            console.error("Error marking as read:", error);
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching contact details:", error);
      // Fallback to using the message from list
      setSelectedMessage(message);
      setShowDetails(true);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async (id: string) => {
    setDeleteModalConfig({ type: "single", id });
    setShowDeleteModal(true);
  };

  const confirmDeleteMessage = async () => {
    if (!deleteModalConfig || deleteModalConfig.type !== "single" || !deleteModalConfig.id) {
      return;
    }

    const { id } = deleteModalConfig;
    setShowDeleteModal(false);
    setDeleteModalConfig(null);

    try {
      // Actually delete the contact using the delete endpoint
      const result = await deleteContact(id);
      if (result.success) {
        // Refresh messages list from API to ensure data consistency
        const refreshResult = await getAllContacts({
          page: currentPage,
          limit: 20,
          search: searchQuery || undefined,
          date_filter: dateFilter || undefined,
          sort_by: 'createdAt',
          sort_order: 'DESC'
        });

        if (refreshResult.success && refreshResult.data) {
          // Map API response to frontend format using reusable mapper
          const mappedData = Array.isArray(refreshResult.data.contacts)
            ? mapContacts(refreshResult.data.contacts)
            : [];

          setMessages(mappedData);

          // Update pagination
          if (refreshResult.data.pagination) {
            setTotalPages(refreshResult.data.pagination.totalPages || 1);
            setTotalContacts(refreshResult.data.pagination.total || 0);
          }
        }

        // Clear checked rows since indices may have changed
        setCheckedRows([]);
        toast.success("Contact message deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete contact message");
      }
    } catch (error: any) {
      console.error("Delete contact error:", error);
      toast.error(error.message || "Failed to delete contact message");
    }
  };

  const handleDeleteSelected = async () => {
    if (checkedRows.length === 0) {
      toast.warning("Please select at least one contact message to delete");
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
    const selectedMessageIds = checkedRows.filter((id) => id !== undefined);

    if (selectedMessageIds.length === 0) {
      toast.error("No valid contact messages selected");
      setIsLoading(false);
      return;
    }

    try {
      // Delete all selected contacts in parallel
      const deletePromises = selectedMessageIds.map((id) =>
        deleteContact(id)
      );
      const results = await Promise.all(deletePromises);

      // Check if all deletions were successful
      const allSuccess = results.every((result) => result.success);
      const failedCount = results.filter((result) => !result.success).length;

      if (allSuccess) {
        toast.success(
          `${selectedMessageIds.length} contact message(s) deleted successfully!`
        );
        // Clear checked rows
        setCheckedRows([]);
        // Reset to first page after successful deletion
        setCurrentPage(1);
        // Refresh contacts list
        const result = await getAllContacts({
          page: 1, // Use page 1 after reset
          limit: 20,
          search: searchQuery || undefined,
          date_filter: dateFilter || undefined,
          sort_by: 'createdAt',
          sort_order: 'DESC'
        });

        if (result.success && result.data?.contacts) {
          setMessages(mapContacts(result.data.contacts));
          if (result.data.pagination) {
            setTotalPages(result.data.pagination.totalPages || 1);
            setTotalContacts(result.data.pagination.total || 0);
          }
        }
      } else {
        toast.error(
          `Failed to delete ${failedCount} contact message(s). Please try again.`
        );
        // Still refresh the list to show current state
        const result = await getAllContacts({
          page: currentPage,
          limit: 20,
          search: searchQuery || undefined,
          date_filter: dateFilter || undefined,
          sort_by: 'createdAt',
          sort_order: 'DESC'
        });

        if (result.success && result.data?.contacts) {
          setMessages(mapContacts(result.data.contacts));
          if (result.data.pagination) {
            setTotalPages(result.data.pagination.totalPages || 1);
            setTotalContacts(result.data.pagination.total || 0);
          }
        }
      }
    } catch (error: any) {
      console.error("Delete selected contacts error:", error);
      toast.error(error.message || "Failed to delete contact messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await markAsRead(id);
      if (result.success) {
        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, status: 'read' } : msg
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAsResponded = async (id: string) => {
    try {
      const result = await updateContactStatus(id, { responded: true });
      if (result.success) {
        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, responded: 1 } : msg
          )
        );
      }
    } catch (error: any) {
      console.error("Error marking as responded:", error);
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
  const filteredMessages = messages.filter((msg) => {
  if (!searchQuery.trim()) return true;

  const q = searchQuery.toLowerCase();

  return (
    msg.patient?.toLowerCase().includes(q) ||
    msg.email?.toLowerCase().includes(q) ||
    msg.phone?.toLowerCase().includes(q) ||
    msg.subject?.toLowerCase().includes(q) ||
    msg.message?.toLowerCase().includes(q)
  );
});


  // Sort messages based on sortConfig (client-side sorting for now)
 const sortedMessages = [...filteredMessages].sort((a, b) => {
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
    if (checkedRows.length === sortedMessages.length && sortedMessages.length > 0) {
      setCheckedRows([]);
    } else {
      setCheckedRows(sortedMessages.map((msg) => msg.id));
    }
  };

  return (
    <div className="contact-message-container">
      <div className="main-content">
        <div className="contact-message-content">
          {/* Header Section */}
          <div className="contact-header-section">
            <div className="contact-header">
              <div className="contact-text">
                <h1 className="contact-title">Contact Message</h1>
                <p className="contact-subtitle">
                  Manage and schedule patient appointments
                </p>
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
                        target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className = "contact-search-icon-fallback";
                        fallback.textContent = "🔍";
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

                  {/* Date Filter Button with Calendar Icon - Right side of search */}
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
                          {dateFilterOptions.find(opt => opt.value === dateFilter)?.label || "All Time"}
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
                            className={`custom-checkbox ${
                              checkedRows.length === sortedMessages.length && sortedMessages.length > 0
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
                      {/* Email Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("email")}
                        >
                          <span className="header-text">Email Address</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "email" &&
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
                                sortConfig.column === "email" &&
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
                      {/* Subject Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("subject")}
                        >
                          <span className="header-text">Subject</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "subject" &&
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
                                sortConfig.column === "subject" &&
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
                      {/* Message Column Header */}
                      <th>
                        <div
                          className="patient-column-header"
                          onClick={() => handleSort("message")}
                        >
                          <span className="header-text">Message</span>
                          <span className="sort-icons">
                            <img
                              src="./sort-asc.svg"
                              alt="Asc"
                              className={`sort-icon ${
                                sortConfig.column === "message" &&
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
                                sortConfig.column === "message" &&
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: "2rem" }}>
                          Loading contacts...
                        </td>
                      </tr>
                    ) : sortedMessages.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: "2rem" }}>
                          No contact messages found
                        </td>
                      </tr>
                    ) : (
                      sortedMessages.map((message) => (
                        <tr key={message.id} className="table-row">
                          <td className="table-cell">
                            <div className="checkbox-cell">
                              <div
                                className={`custom-checkbox ${
                                  checkedRows.includes(message.id) ? "checked" : ""
                                }`}
                                onClick={() => handleCheckboxChange(message.id)}
                              >
                                <span className="checkmark">✓</span>
                              </div>
                            </div>
                          </td>
                          <td className="table-cell patient-cell">
                            <div className="patient-info">
                              <div className="patient-name">
                                {message.patient}
                              </div>
                            </div>
                          </td>
                          <td className="table-cell email-cell">
                            {message.email}
                          </td>
                          <td className="table-cell date-cell">
                            {message.date}
                          </td>
                          <td className="table-cell time-cell">
                            {message.time}
                          </td>
                          <td className="table-cell subject-cell">
                            <span className="subject-badge">
                              {message.subject}
                            </span>
                          </td>
                          <td className="table-cell phone-cell">
                            {message.phone}
                          </td>
                          <td className="table-cell message-cell">
                            <div className="message-preview">
                              {message.message && message.message.length > 50
                                ? `${message.message.substring(0, 50)}...`
                                : message.message || ""}
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
                                    target.style.display = "none";
                                    const fallback =
                                      document.createElement("div");
                                    fallback.className = "delete-icon-fallback";
                                    fallback.textContent = "🗑️";
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
                                    target.style.display = "none";
                                    const fallback =
                                      document.createElement("div");
                                    fallback.className = "view-icon-fallback";
                                    fallback.textContent = "👁️";
                                    target.parentNode?.appendChild(fallback);
                                  }}
                                />
                              </button>
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
                Showing {messages.length > 0 ? (currentPage - 1) * 20 + 1 : 0} - {Math.min(currentPage * 20, totalContacts)} out of {totalContacts}
                {unreadCount > 0 && (
                  <span style={{ marginLeft: "1rem", color: "#ff4444", fontWeight: "bold" }}>
                    ({unreadCount} unread)
                  </span>
                )}
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

          {/* Message Details Modal - Shows on top of table */}
          {showDetails && selectedMessage && (
            <>
              {/* Overlay */}
              <div
                className="message-modal-overlay"
                onClick={handleCloseDetails}
              ></div>

              {/* Message Details Modal - Using same design as message-contact-table.png */}
              <div className="message-details-modal">
                <div className="message-details-card">
                  {/* Header with title and close button */}
                  <div className="message-details-subtitle">
                    Message Details
                  </div>

                  <button
                    className="modal-close-btn"
                    onClick={handleCloseDetails}
                  >
                    ✕
                  </button>

                  {/* Field Group Container with 22px gap */}
                  <div className="field-group-container">
                    {/* Patient Name with A bullet - Exactly like in image */}
                    <div className="subject-section-modal">
                      <div className="field-label-with-icon">
                        <img
                          src={UserIcon}
                          alt="Patient Name"
                          className="field-icon"
                        />
                        <span className="field-label">Patient Name</span>
                      </div>
                      <div className="subject-value-modal">
                        {selectedMessage.patient}
                      </div>
                    </div>

                    {/* Email and Phone - Same row like in image */}
                    <div className="contact-info-row">
                      <div className="contact-field-with-icon">
                        <div className="field-label-with-icon">
                          <img
                            src={EmailIcon}
                            alt="Email"
                            className="field-icon"
                          />
                          <span className="field-label">Email Address</span>
                        </div>
                        <div className="field-value email-value">
                          {selectedMessage.email}
                        </div>
                      </div>
                      <div className="contact-field-with-icon">
                        <div className="field-label-with-icon">
                          <img
                            src={PhoneIcon}
                            alt="Phone"
                            className="field-icon"
                          />
                          <span className="field-label">Phone Number</span>
                        </div>
                        <div className="field-value phone-value">
                          {selectedMessage.phone}
                        </div>
                      </div>
                    </div>

                    {/* Date and Time - Same row like in image */}
                    <div className="datetime-row">
                      <div className="datetime-field">
                        <div className="field-label-with-icon">
                          <img
                            src={DateIcon}
                            alt="Date"
                            className="field-icon"
                          />
                          <span className="field-label">Date</span>
                        </div>
                        <div className="field-value">
                          {selectedMessage.date}
                        </div>
                      </div>
                      <div className="datetime-field">
                        <div className="field-label-with-icon">
                          <img
                            src={TimeIcon}
                            alt="Time"
                            className="field-icon"
                          />
                          <span className="field-label">Time</span>
                        </div>
                        <div className="field-value">
                          {selectedMessage.time}
                        </div>
                      </div>
                    </div>

                    {/* Subject Section */}
                    <div className="subject-section-modal">
                      <div className="field-label-with-icon">
                        <img
                          src={SubjectIcon}
                          alt="Subject"
                          className="field-icon"
                        />
                        <span className="field-label">Subject</span>
                      </div>
                      <div className="subject-value-modal">
                        {selectedMessage.subject}
                      </div>
                    </div>

                    {/* Message Section */}
                    <div className="message-section-modal">
                      <div className="field-label-with-icon">
                        <img
                          src={MessageIcon}
                          alt="Message"
                          className="field-icon"
                        />
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
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title={
          deleteModalConfig?.type === "single"
            ? "Delete Contact Message"
            : "Delete Contact Messages"
        }
        message={
          deleteModalConfig?.type === "single"
            ? "Are you sure you want to delete this contact message? This action cannot be undone."
            : `Are you sure you want to delete ${deleteModalConfig?.count || 0} contact message(s)? This action cannot be undone.`
        }
        onConfirm={() => {
          if (deleteModalConfig?.type === "single") {
            confirmDeleteMessage();
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

export default ContactMessage;
