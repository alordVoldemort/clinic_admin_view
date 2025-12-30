// API Connection Test
// Use this to test your live API connection

import { API_CONFIG, getEndpointURL } from './config';

export const testAPIConnection = async () => {
  console.log('🧪 Testing API Connection...');
  console.log('Target URL:', API_CONFIG.BASE_URL);
  
  try {
    // Test 1: Basic API Status
    console.log('📡 Testing basic API connectivity...');
    const response = await fetch(API_CONFIG.BASE_URL);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API is reachable:', data);
      return {
        success: true,
        message: 'API connection successful',
        data: data
      };
    } else {
      console.log('❌ API returned error:', response.status);
      return {
        success: false,
        message: `API returned status: ${response.status}`,
        data: null
      };
    }
  } catch (error) {
    console.log('❌ API connection failed:', error.message);
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
};

// Test login endpoint specifically
export const testLoginEndpoint = async (email, password) => {
  console.log('🔐 Testing login endpoint...');
  
  try {
    const response = await fetch(getEndpointURL(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Login test successful:', data);
      return { success: true, data };
    } else {
      console.log('❌ Login test failed:', data);
      return { success: false, error: data.message || 'Login failed' };
    }
  } catch (error) {
    console.log('❌ Login endpoint error:', error.message);
    return { success: false, error: error.message };
  }
};

// Quick test function you can call from console
export const quickTest = () => {
  console.log('🚀 Quick API Test');
  console.log('================');
  console.log('API Base URL:', API_CONFIG.BASE_URL);
  console.log('Available endpoints:');
  console.log('- Login:', getEndpointURL(API_CONFIG.ENDPOINTS.AUTH.LOGIN));
  console.log('- Profile:', getEndpointURL(API_CONFIG.ENDPOINTS.AUTH.ME));
  console.log('- Refresh:', getEndpointURL(API_CONFIG.ENDPOINTS.AUTH.REFRESH));
  console.log('- Logout:', getEndpointURL(API_CONFIG.ENDPOINTS.AUTH.LOGOUT));
  
  // Test basic connectivity
  testAPIConnection().then(result => {
    if (result.success) {
      console.log('🎉 Your PHP backend is live and responding!');
    } else {
      console.log('⚠️ Backend connection issue:', result.message);
    }
  });
};