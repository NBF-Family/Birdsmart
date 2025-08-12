import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HealthCheck from './components/HealthCheck'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HealthCheck />} />
        <Route path="/health" element={<HealthCheck />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
