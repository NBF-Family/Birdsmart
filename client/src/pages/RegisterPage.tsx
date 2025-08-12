// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/apis/authApi';
import { useFormValidation } from '../hooks/userFormValidation';
import type { RegisterFormData, ApiError } from '../types/auth';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { FormInput } from '../components/common/FormInput';
import { SubmitButton } from '../components/common/SubmitButton';
import { FormSelect } from '../components/common/FormSelect';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { errors, validateRegisterForm, clearErrors } = useFormValidation();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '', // Optional
    location: {
      city: '',    // Optional
      state: '',   // Optional
      country: '', // Optional
      cords: [0, 0], // Optional
    },
    role: 'buyer',
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      clearErrors();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateRegisterForm(formData)) {
      return;
    }

    setLoading(true);

    try {
      const user = await authApi.register(formData);
      console.log('Registration successful:', user);
      
      // Redirect to login page
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' }
      });
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'buyer', label: 'Buy Birds' },
    { value: 'seller', label: 'Sell Birds' },
  ];

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Create Account</h1>
      <ErrorAlert message={apiError} />

      <form onSubmit={handleSubmit}>
        <FormInput
          id="username"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
        <FormInput
          id="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <FormInput
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        <FormInput
          id="fullName"
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name (optional)"
        />

        <FormInput
          id="city"
          name="city"
          label="City"
          value={formData.location.city}
          onChange={handleChange}
          placeholder="Enter your city (optional)"
        />

        <FormInput
          id="state"
          name="state"
          label="State"
          value={formData.location.state}
          onChange={handleChange}
          placeholder="Enter your state (optional)"
        />

        <FormInput
          id="country"
          name="country"
          label="Country" 
          value={formData.location.country}
          onChange={handleChange}
          placeholder="Enter your country (optional)"
        />
         
        <FormSelect
          id="role"
          name="role"
          label="I want to"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
          required
          style={{ marginBottom: '20px' }}
        />

        <SubmitButton 
          loading={loading} 
          loadingText="Creating Account..."
        >
          Create Account
        </SubmitButton>
      </form>  

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};