import React from 'react';

interface FormInputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const FormInput: React.FC<FormInputProps> = ({
    id,
    name,
    type = 'text',
    label,
    value,
    onChange,
    error,
    required = false,
    placeholder,
    style,
  }) => {
    return (
      <div style={{ marginBottom: '15px', ...style }}>
        <label htmlFor={id}>
          {label} {required && '*'}
        </label>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '8px',
            marginTop: '5px',
            border: error ? '1px solid #c33' : '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {error && (
          <div style={{ color: '#c33', fontSize: '14px', marginTop: '5px' }}>
            {error}
          </div>
        )}
      </div>
    );
  };