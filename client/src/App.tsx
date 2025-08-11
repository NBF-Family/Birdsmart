import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HealthCheck from './components/HealthCheck'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HealthCheck />} />
        <Route path="/health" element={<HealthCheck />} />
      </Routes>
    </Router>
  )
}

export default App
