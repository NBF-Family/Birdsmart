import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string;
  required?: boolean;
  style?: React.CSSProperties;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  style,
}) => {
  return (
    <div style={{ marginBottom: '15px', ...style }}>
      <label htmlFor={id}>
        {label} {required && '*'}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '8px',
          marginTop: '5px',
          border: error ? '1px solid #c33' : '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div style={{ color: '#c33', fontSize: '14px', marginTop: '5px' }}>
          {error}
        </div>
      )}
    </div>
  );
};