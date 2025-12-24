import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../apis/admin';
import './Login.css';

const Login: React.FC = () => {
  // Hardcoded admin credentials for testing
  const [email, setEmail] = useState('admin@clinic.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Development mode: Bypass API for testing (set to true to enable)
    const DEV_MODE_BYPASS = false;

    if (DEV_MODE_BYPASS) {
      // Hardcoded mock response for development
      const mockAdminData = {
        id: 'dev-admin-id',
        name: 'Admin User',
        email: email,
        role: 'admin',
        is_active: 1
      };
      const mockToken = 'dev-mock-token-' + Date.now();
      
      localStorage.setItem('adminToken', mockToken);
      localStorage.setItem('adminData', JSON.stringify(mockAdminData));
      
      setTimeout(() => {
        navigate('/dashboard');
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const result = await login({ email, password });

      if (result.success) {
        // Token and admin data are already stored by the login API function
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-frame">
        
       
        <div className="logo-wrapper">
          <img 
            src="./Logo.svg" 
            alt="Nirmal Health Care" 
            className="login-logo"
          />
        </div>
        
        
        <p className="login-subtitle">
          Sign in to manage your clinic
        </p>

       
        <form className="login-form" onSubmit={handleSubmit}>
          
       
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <img 
                src="/email-icon.svg" 
                alt="Email" 
                className="input-icon"
              />
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@clinic.com"
                required
              />
            </div>
          </div>

          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <img 
                src="/password-icon.svg" 
                alt="Password" 
                className="input-icon"
              />
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <img
                src={showPassword ? "/eye-off-icon.svg" : "/eye-icon.svg"}
                alt={showPassword ? "Hide password" : "Show password"}
                className="eye-icon"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

        
          <div className="form-options">
            <div className="remember-me">
              


              
              
            </div>
            
          </div>

          
          {error && (
            <div className="error-message" style={{ 
              color: '#ff4444', 
              marginBottom: '1rem', 
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="signin-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;