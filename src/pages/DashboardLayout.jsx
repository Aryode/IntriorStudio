// src/pages/DashboardLayout.jsx

import React, { useState } from 'react';
// 1. Import Link dari react-router-dom
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LayoutDashboard, Briefcase, Mail, LogOut } from 'lucide-react';

// Import komponen-komponen view
import DashboardHomepage from '../components/dashboard/DashboardHomepage';
import ProjectManagement from '../components/dashboard/ProjectManagement';
import ServiceRequestManagement from '../components/dashboard/ServiceRequestManagement';

const navItems = [
  { id: 'homepage', label: 'Homepage', icon: LayoutDashboard, component: <DashboardHomepage /> },
  { id: 'projects', label: 'Project Management', icon: Briefcase, component: <ProjectManagement /> },
  { id: 'requests', label: 'Service Request Management', icon: Mail, component: <ServiceRequestManagement /> },
];

export default function DashboardLayout() {
  const [activeView, setActiveView] = useState('homepage');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };

  const ActiveComponent = navItems.find(item => item.id === activeView)?.component;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-white flex flex-col">
        {/* 2. Ubah div menjadi komponen Link */}
        <Link to="/" className="p-6 text-2xl font-bold border-b border-indigo-900 hover:bg-indigo-900 transition-colors">
          IntriorStudio
        </Link>
        <nav className="flex-grow pt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-6 py-4 text-left transition-colors ${
                activeView === item.id
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-300 hover:bg-indigo-900 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-left text-indigo-300 hover:bg-indigo-900 hover:text-white rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        {ActiveComponent}
      </main>
    </div>
  );
}