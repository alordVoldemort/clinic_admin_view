// Debug utility to test API connectivity
export const debugAPI = async () => {
  console.log('🔍 API Debug Information');
  console.log('========================');
  
  const testURLs = [
    'https://nirmalhealthcare.co.in',
    'https://nirmalhealthcare.co.in/api/auth/login',
    '/api/auth/login' // This will use the proxy
  ];
  
  for (const url of testURLs) {
    try {
      console.log(`\n🌐 Testing: ${url}`);
      
      const response = await fetch(url, {
        method: url.includes('login') ? 'OPTIONS' : 'GET',
        headers: {
          'Origin': window.location.origin || 'https://nirmalhealthcare.co.in'
        }
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const text = await response.text();
        console.log(`📄 Response:`, text.substring(0, 200));
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
};

// Call this function in your browser console
window.debugAPI = debugAPI;