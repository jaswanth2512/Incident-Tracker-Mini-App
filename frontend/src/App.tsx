import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import CreateIncident from './pages/CreateIncident';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/incidents" replace />} />
          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/incidents/new" element={<CreateIncident />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

