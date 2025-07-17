import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
// 1. Import hook yang diperlukan dari react-router-dom
import { useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { id: "home", name: "Home" },
  // Pastikan id ini cocok dengan id di komponen AboutUs.jsx
  { id: "about", name: "About Us" },
  { id: "projects", name: "Projects" },
  // Pastikan id ini cocok dengan id di komponen ContactUs.jsx
  { id: "contact", name: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // 2. Inisialisasi hook dari react-router-dom
  const location = useLocation();
  const navigate = useNavigate();

  // Effect untuk background navbar saat scroll (Tidak diubah)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect untuk mendeteksi section aktif saat scroll
  useEffect(() => {
    const handleActiveSection = () => {
      if (location.pathname === "/") {
        let currentSection = "";
        for (const link of navLinks) {
          const section = document.getElementById(link.id);
          if (section && window.scrollY >= section.offsetTop - 150) {
            currentSection = link.id;
          }
        }
        setActiveSection(currentSection || "home");
      }
    };

    window.addEventListener("scroll", handleActiveSection);
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, [location.pathname]);

  // 3. Logika scroll yang telah diperbarui
  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setActiveSection(sectionId);
        }
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveSection(sectionId);
      }
    }
  };

  // --- Logika Warna Dinamis (Tidak diubah) ---
  const navTextColor =
    scrolled || location.pathname !== "/" ? "text-white" : "text-indigo-950";
  const navTextInactiveColor =
    scrolled || location.pathname !== "/"
      ? "text-indigo-300 hover:text-white"
      : "text-indigo-950/70 hover:text-indigo-950";
  const underlineColor =
    scrolled || location.pathname !== "/" ? "bg-indigo-400" : "bg-indigo-950";
  const headerBg =
    scrolled || location.pathname !== "/"
      ? "bg-indigo-950 shadow-md"
      : "bg-transparent";

  // --- [BARU] Logika warna dinamis untuk tombol login ---
  const loginButtonColor =
    scrolled || location.pathname !== "/"
      ? "text-white border-indigo-400 hover:bg-indigo-400 hover:text-indigo-950"
      : "text-indigo-950 border-indigo-950 hover:bg-indigo-950 hover:text-white";

  return (
    <header
      className={`py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("home")}
          className={`font-bold text-xl transition-colors duration-300 ${navTextColor}`}
        >
          IntriorStudio
        </button>

        {/* [MODIFIKASI] Navigasi Desktop & Tombol Login */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative font-medium transition-colors duration-300 ${
                  activeSection === link.id
                    ? navTextColor
                    : navTextInactiveColor
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-2 left-0 w-full h-0.5 transform transition-transform duration-300 ease-out ${underlineColor} ${
                    activeSection === link.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* [BARU] Tombol Login untuk Desktop */}
          <button
            onClick={() => navigate("/login")}
            className={`font-medium border rounded-full px-4 py-1.5 transition-colors duration-300 ${loginButtonColor}`}
          >
            Log In
          </button>
        </div>

        {/* Tombol Menu Mobile */}
        <button
          className={`md:hidden transition-colors duration-300 ${navTextColor}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-indigo-950/95 backdrop-blur-sm mt-4 py-4 shadow-lg">
          <div className="container mx-auto px-6 flex flex-col items-start space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="font-medium text-left w-full py-2 transition-colors duration-300 text-indigo-900 dark:text-white"
              >
                {link.name}
              </button>
            ))}
            {/* [BARU] Tombol Login untuk Mobile */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
              className="font-medium text-left w-full py-2 transition-colors duration-300 text-indigo-900 dark:text-white mt-2 border-t border-gray-200 dark:border-gray-700 pt-3"
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
