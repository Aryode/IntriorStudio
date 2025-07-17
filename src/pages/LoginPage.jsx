import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginPage() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fungsi yang dijalankan saat form disubmit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');     

    try {
      // Kirim email dan password ke Firebase untuk verifikasi
      await signInWithEmailAndPassword(auth, email, password);
      
      // Jika berhasil, arahkan ke halaman dashboard
      navigate('/dashboard');

    } catch (err) {
      // Jika gagal, tangkap dan tampilkan pesan error
      setError('Email atau password salah. Silakan coba lagi.');
      console.error("Error saat login:", err);
    } finally {
      // Hentikan proses loading, baik berhasil maupun gagal
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-16 px-4" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-950">Log In</h1>
          <p className="text-lg text-indigo-950/80 mt-1">IntriorStudio</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email :
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 text-black bg-slate-100 border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password :
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 text-black bg-slate-100 border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* 3. Tampilkan pesan error jika ada */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading} // Tombol tidak bisa diklik saat loading
                className="w-full sm:w-auto bg-indigo-950 text-white font-bold py-3 px-12 rounded-md hover:bg-indigo-800 transition-colors duration-300 disabled:bg-indigo-400"
              >
                {/* Tampilkan teks berbeda saat loading */}
                {loading ? 'Logging In...' : 'LOG IN'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
