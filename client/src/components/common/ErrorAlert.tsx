import React from 'react';

interface ErrorAlertProps {
  message: string;
  style?: React.CSSProperties;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, style }) => {
  if (!message) return null;

  return (
    <div
      style={{
        backgroundColor: '#fee',
        color: '#c33',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #fcc',
        borderRadius: '4px',
        ...style,
      }}
    >
      {message}
    </div>
  );
};