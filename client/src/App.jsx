import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClaimForm from './pages/ClaimForm';
import MyClaims from './pages/MyClaims';
import FraudReport from './pages/FraudReport';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/claims/new" element={
            <ProtectedRoute><ClaimForm /></ProtectedRoute>
          } />
          <Route path="/claims/my" element={
            <ProtectedRoute><MyClaims /></ProtectedRoute>
          } />
          <Route path="/fraud/report" element={
            <ProtectedRoute roles={['admin', 'investigator']}><FraudReport /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}