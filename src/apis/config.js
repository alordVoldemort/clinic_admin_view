// API Configuration for Live Production
export const API_CONFIG = {
  // Always use domain URL for both development and production - backend allows localhost:3000 CORS
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://nirmalhealthcare.co.in/clinic-backend-php',
  
  // Available PHP Backend Endpoints
  ENDPOINTS: {
    // Authentication (✅ Available in PHP Backend)
    AUTH: {
      LOGIN: '/api/auth/login',           // POST - Admin login
      LOGOUT: '/api/auth/logout',         // POST - Admin logout
      ME: '/api/auth/me',                 // GET - Get current user
      REFRESH: '/api/auth/refresh',       // POST - Refresh JWT token
    },
    
    // Admin Profile (⚠️ To be implemented in PHP)
    ADMIN: {
      PROFILE: '/api/auth/profile',       // PUT - Update profile (needs implementation)
    },
    
    // Appointments (⚠️ To be implemented in PHP)
    APPOINTMENTS: {
      LIST: '/api/appointments',          // GET - List appointments
      CREATE: '/api/appointments',        // POST - Create appointment
      UPDATE: '/api/appointments',        // PUT - Update appointment
      DELETE: '/api/appointments',        // DELETE - Delete appointment
    },
    
    // Contacts (⚠️ To be implemented in PHP)
    CONTACTS: {
      LIST: '/api/contacts',              // GET - List contact messages
      UPDATE: '/api/contacts',            // PUT - Update contact status
    },
    
    // Testimonials (⚠️ To be implemented in PHP)
    TESTIMONIALS: {
      LIST: '/api/testimonials',          // GET - List testimonials
      CREATE: '/api/testimonials',        // POST - Create testimonial
      DELETE: '/api/testimonials',        // DELETE - Delete testimonial
    }
  },
  
  // Request Configuration
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to get full endpoint URL
export const getEndpointURL = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Current Status of Endpoints
export const ENDPOINT_STATUS = {
  READY: ['AUTH.LOGIN', 'AUTH.LOGOUT', 'AUTH.ME', 'AUTH.REFRESH'],
  PENDING: ['ADMIN.PROFILE', 'APPOINTMENTS.*', 'CONTACTS.*', 'TESTIMONIALS.*']
};