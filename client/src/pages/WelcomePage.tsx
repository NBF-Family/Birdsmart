import HealthCheck from '../components/HealthCheck';
import { Link } from 'react-router-dom';

export const WelcomePage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Birdsmart!</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <Link to="/listings" style={{ marginRight: '1rem', textDecoration: 'none' }}>
          <button>Browse Listings</button>
        </Link>
        <Link to="/login" style={{ marginRight: '1rem', textDecoration: 'none' }}>
          <button>Login</button>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button>Register</button>
        </Link>
      </div>

      <div style={{ marginTop: '3rem', borderTop: '1px solid #ccc', paddingTop: '2rem' }}>
        <HealthCheck />
      </div>
    </div>
  );
};
