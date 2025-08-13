import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HealthCheck from './components/HealthCheck'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { WelcomePage } from './pages/WelcomePage'
import { ListingsPage } from './pages/ListingsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/health" element={<HealthCheck />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/listings" element={<ListingsPage />} />
      </Routes>
    </Router>
  )
}

export default App
