import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Layout from './components/Layout';
import PrivateRoute from './utils/PrivateRoute';
import Login from './features/auth/components/Login/Login';
import Register from './features/auth/components/Register/Register';
import UsersList from './features/users/UsersList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="users" element={<UsersList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
