# API Services

This folder contains all API integration services for the clinic admin panel.

## Structure

- `axios.js` - Axios instance configuration with interceptors for authentication and error handling
- `admin.js` - Admin API service functions (login, logout, profile, etc.)
- `index.js` - Central export point for all API services

## Usage

### Import API functions

```javascript
import { login, logout, getProfile, updateProfile, verifyToken } from '../apis/admin';
// or
import { login, logout } from '../apis';
```

### Example: Login

```javascript
import { login } from '../apis/admin';

const handleLogin = async () => {
  try {
    const result = await login({ 
      email: 'admin@example.com', 
      password: 'password123' 
    });
    
    if (result.success) {
      // Token and admin data are automatically stored in localStorage
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

### Example: Get Profile

```javascript
import { getProfile } from '../apis/admin';

const fetchProfile = async () => {
  try {
    const response = await getProfile();
    if (response.success) {
      console.log('Admin data:', response.data.admin);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## API Endpoints

### Admin APIs

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/profile` - Get admin profile (requires auth)
- `PUT /api/admin/profile` - Update admin profile (requires auth)
- `GET /api/admin/verify-token` - Verify authentication token (requires auth)

## Configuration

The base URL is configured via the `REACT_APP_BASE_URL` environment variable. If not set, it defaults to `http://localhost:80/Clinic_Website_Backend_PHP-main`.

Create a `.env` file in the project root:

```
REACT_APP_BASE_URL=http://localhost:80/Clinic_Website_Backend_PHP-main
```

## Authentication

The axios instance automatically:
- Adds the `Authorization: Bearer <token>` header to all requests
- Stores the token in localStorage after successful login
- Clears the token and redirects to login on 401 errors
- Handles token expiration and invalid tokens

## Error Handling

All API functions throw errors that can be caught and handled:

```javascript
try {
  await login(credentials);
} catch (error) {
  // error.message - Error message
  // error.status - HTTP status code (if available)
  // error.data - Additional error data (if available)
}
```

