import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { Charities } from './pages/Charities';
import { Draws } from './pages/Draws';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Member Pages
import { UserDashboard } from './pages/UserDashboard';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { UsersManager } from './pages/admin/UsersManager';
import { DrawsManager } from './pages/admin/DrawsManager';
import { CharitiesManager } from './pages/admin/CharitiesManager';
import { WinnersManager } from './pages/admin/WinnersManager';
import { ContactMessages } from './pages/admin/ContactMessages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with standard Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/charities" element={<Charities />} />
            <Route path="/draws" element={<Draws />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Member Route */}
          <Route element={<ProtectedRoute requireAdmin={false} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="draws" element={<DrawsManager />} />
              <Route path="charities" element={<CharitiesManager />} />
              <Route path="winners" element={<WinnersManager />} />
              <Route path="messages" element={<ContactMessages />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
