import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@nirmalhealthcare.co.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/admin/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
    console.log(
  'API URL:',
  process.env.REACT_APP_API_BASE_URL
);


    const result = await response.json();

    if (result.success) {
     
      localStorage.setItem('adminToken', result.data.token);
      localStorage.setItem('adminData', JSON.stringify(result.data.admin));

     
      navigate('/dashboard');
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Something went wrong. Please try again.');
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

          
          <button type="submit" className="signin-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;