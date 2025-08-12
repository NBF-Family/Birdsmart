import React from 'react';

interface SubmitButtonProps {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  loadingText = 'Loading...',
  children,
  style,
}) => {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%',
        padding: '12px',
        backgroundColor: loading ? '#ccc' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: loading ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {loading ? loadingText : children}
    </button>
  );
};