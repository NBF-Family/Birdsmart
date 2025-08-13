import HealthCheck from '../components/HealthCheck';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const WelcomePage = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout fails
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Birdsmart{user ? `, ${user.username}` : ''}!</h1>
      
      <div style={{ marginTop: '2rem' }}>  
        {user ? (
          <div>
            <p>You are logged in as: <strong>{user.email}</strong></p>
            <button 
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login" style={{ marginRight: '1rem', textDecoration: 'none' }}>
              <button>Login</button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button>Register</button>
            </Link>
            <Link to="/listings" style={{ textDecoration: 'none' }}>
              <button>Listings</button>
            </Link>
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', borderTop: '1px solid #ccc', paddingTop: '2rem' }}>
        <HealthCheck />
      </div>
    </div>
  );
};