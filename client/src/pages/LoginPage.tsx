// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/apis/authApi';
import { tokenStorage } from '../utils/tokenStorage';
import { FormInput } from '../components/common/FormInput';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { SubmitButton } from '../components/common/SubmitButton';

interface LoginFormData {
  email: string;
  password: string;
}

interface LocationState {
  message?: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>(state?.message || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login(formData.email, formData.password) as { access_token: string };
      
      // Store the access token
      tokenStorage.setToken(response.access_token);
      
      console.log('Login successful:', response);
      
      // Redirect to dashboard or home page
      navigate('/');
      
    } catch (error: any) {
      console.error('Login failed:', error);
      setApiError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Welcome Back
      </h1>
      
      {/* Success message from registration */}
      {successMessage && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
        }}>
          {successMessage}
        </div>
      )}
      
      <ErrorAlert message={apiError} />

      <form onSubmit={handleSubmit}>
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="Enter your email"
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          placeholder="Enter your password"
        />

        <SubmitButton 
          loading={loading} 
          loadingText="Signing In..."
          style={{ marginTop: '10px' }}
        >
          Sign In
        </SubmitButton>
      </form>

      {/* Additional Links */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/forgot-password')} // You can implement this later
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '10px'
          }}
        >
          Forgot Password?
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0' }}>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};