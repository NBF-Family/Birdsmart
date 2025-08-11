import { useState, useEffect } from 'react';
import { healthApi, type HealthCheckResponse } from '../apis/healthApi';

interface HealthStatus {
  loading: boolean;
  data: HealthCheckResponse | null;
  error: string | null;
  lastChecked: Date | null;
}

const HealthCheck = () => {
  const [health, setHealth] = useState<HealthStatus>({
    loading: true,
    data: null,
    error: null,
    lastChecked: null
  });

  const checkHealth = async () => {
    setHealth(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await healthApi.checkHealth();
      setHealth({
        loading: false,
        data,
        error: null,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to check health',
        lastChecked: new Date()
      });
    }
  };

  // Check health on component mount
  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusText = () => {
    if (health.loading) return 'Checking...';
    if (health.error) return 'Offline';
    if (health.data?.status === 'OK') return 'Online';
    return 'Unknown';
  };

  return (
    <div>
      <h1>Health Check</h1>
      
      <p>
        Status: <span>
          {getStatusText()}
        </span>
      </p>

      {health.data && (
        <p>Message: {health.data.message}</p>
      )}

      {health.error && (
        <p style={{ color: 'red' }}>Error: {health.error}</p>
      )}

      {health.lastChecked && (
        <p>Last checked: {health.lastChecked.toLocaleTimeString()}</p>
      )}

      <button onClick={checkHealth} disabled={health.loading}>
        {health.loading ? 'Checking...' : 'Refresh'}
      </button>
    </div>
  );
};

export default HealthCheck;
