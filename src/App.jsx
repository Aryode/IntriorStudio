// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Komponen & Halaman
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Projects from './pages/Projects';
import ContactUs from './pages/ContactUs';
import GalleryPage from './pages/GalleryPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout'; 
import ProtectedRoute from './components/ProtectedRoute';
import TawkTo from './components/TawkTo';

const LandingPage = () => (
  <>
    <Home />
    <AboutUs />
    <Projects />
    <ContactUs />
  </>
);

// Komponen untuk halaman publik yang memiliki Navbar dan Footer
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
    <TawkTo /> 
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute publik dengan Navbar, Footer, dan Tawk.to */}
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
        
        {/* Rute login tidak akan memiliki Tawk.to */}
        <Route path="/login" element={
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow"><LoginPage /></main>
                <Footer />
            </div>
        } />
        
        {/* Rute Dashboard yang dilindungi dan juga tidak memiliki Tawk.to */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;