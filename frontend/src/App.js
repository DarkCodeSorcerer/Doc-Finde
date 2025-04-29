import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import DocumentUpload from './components/Document/DocumentUpload';
import DocumentList from './components/Document/DocumentList';
import HomePage from './components/Home/HomePage';
import Login from "./components/Users/Login";
import Register from "./components/Users/Register";
import AdminHome from "./components/Admin/AdminHome";
import AdminNavbar from "./components/Admin/AdminNavbar";
import AdminUserManagement from "./components/Admin/AdminUserManagement";
import UserVaultDashboard from "./components/Home/UserVaultDashboard";
import AdminVaultRequests from "./components/Admin/AdminVaultRequests";
import VaultDetails from "./components/Home/VaultDetails";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}  {/* Show user Navbar only outside /admin */}
      {isAdminRoute && <AdminNavbar />} {/* Show AdminNavbar only inside /admin */}
      {children}
    </>
  );
};

// Wrapper to extract vaultId from URL
const DocumentUploadWrapper = () => {
  const { vaultId } = useParams(); // Get vaultId from URL
  return <DocumentUpload vaultId={vaultId} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Layout>
        <div className="App">
          <main>
            <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
              
              {/* Pass vaultId dynamically */}
              <Route path="/vault/:vaultId/upload-document" element={<DocumentUploadWrapper />} />

              <Route path="/document-list" element={<DocumentList />} />
              <Route path="/admin" element={isAuthenticated ? <AdminHome /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/admin/users" element={<AdminUserManagement />} />
              <Route path="/vault" element={<UserVaultDashboard />} />
              <Route path="/admin/vault-requests" element={<AdminVaultRequests />} />
              <Route path="/vault/:vaultId" element={<VaultDetails />} />
            </Routes>
          </main>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
