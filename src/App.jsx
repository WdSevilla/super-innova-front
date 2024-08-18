/* eslint-disable no-unused-vars */
// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
