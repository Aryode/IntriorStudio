import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

// Komponen ini akan melindungi sebuah rute
// Jika pengguna belum login, ia akan diarahkan ke halaman /login
// Jika sudah, ia akan menampilkan halaman yang seharusnya
const ProtectedRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  // Tampilkan halaman loading selagi status otentikasi diperiksa
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Jika ada error atau tidak ada user (belum login), arahkan ke login
  if (error || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika sudah login, tampilkan konten halaman (children)
  return children;
};

export default ProtectedRoute;
