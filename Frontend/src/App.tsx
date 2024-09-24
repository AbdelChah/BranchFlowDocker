import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { Dashboard } from './Pages/dashboard';
import { Settings } from './Pages/settings';
import { ThemeProvider } from "@/Helpers/theme-provider";
import { ServicesPage } from './Pages/ServicesPage';
import { Toaster } from './components/ui/toaster';
import { Login } from './Pages/login';
import ProtectedRoute from './Helpers/ProtectedRoute';
import PublicRoute from './Helpers/PublicRoute';
import  { AddNewService } from './Pages/addService';
import {StartOfDay} from './Pages/StartOfDay';
import UserManagementPage from './Pages/userManagement';
import { useEffect, useState } from 'react';

import NotFound from './Pages/Serverdown';



function App() {


  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* Use PublicRoute for the login page */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route 
          path="/server-down" 
          element={
            <PublicRoute>
              <NotFound />
            </PublicRoute>
          
          } />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StartOfDay"
            element={
              <ProtectedRoute>
                <StartOfDay />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addService"
            element={
              <ProtectedRoute>
                <AddNewService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userManagement"
            element={
              <ProtectedRoute>
                <UserManagementPage/>
              </ProtectedRoute>
            }
          />
         
         
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
