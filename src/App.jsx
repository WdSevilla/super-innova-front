/* eslint-disable no-unused-vars */
// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from "./components/context/AuthContext";
function App() {
  return (
    <AuthProvider>
    <Router>
         
      <AppRoutes />
    </Router>
    </AuthProvider>

   
  );
}

export default App;
