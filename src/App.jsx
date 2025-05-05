import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

export default function App() {
  const [login, setLogin] = useState(false);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AppRoutes login={login} setLogin={setLogin} />
    </Router>
  );
}