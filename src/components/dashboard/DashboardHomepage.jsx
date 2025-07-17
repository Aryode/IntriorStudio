import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { MessageSquare } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  const statusClasses = {
    New: "bg-blue-100 text-blue-800",
    Contacted: "bg-yellow-100 text-yellow-800",
    'In Progress': "bg-purple-100 text-purple-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
}

export default function DashboardHomepage() {
  const [stats, setStats] = useState({ newSubmissions: 0, completedProjects: 0, clientsInProgress: 0 });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const tawkToDashboardUrl = "https://dashboard.tawk.to/";

  useEffect(() => {
    // Listener untuk Statistik
    const allSubmissionsQuery = query(collection(db, "formSubmissions"));
    const unsubscribeStats = onSnapshot(allSubmissionsQuery, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => doc.data());
      const newCount = submissionsData.filter(s => s.status === 'New').length;
      const inProgressCount = submissionsData.filter(s => s.status === 'In Progress').length;
      const completedCount = submissionsData.filter(s => s.status === 'Completed').length;
      
      setStats({ 
        newSubmissions: newCount, 
        clientsInProgress: inProgressCount, 
        completedProjects: completedCount 
      });
    });

    // Listener untuk Tabel "Recent Submissions"
    const recentSubmissionsQuery = query(
      collection(db, "formSubmissions"), 
      orderBy("submittedAt", "desc"),
      limit(5)
    );
    const unsubscribeRecent = onSnapshot(recentSubmissionsQuery, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentSubmissions(submissionsData);
      setLoading(false);
    });

    return () => {
      unsubscribeStats();
      unsubscribeRecent();
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold text-gray-800">Main Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">New Submission</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : stats.newSubmissions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Completed Projects</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : stats.completedProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Client In Progress</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : stats.clientsInProgress}</p>
        </div>
      </div>

      {/* Recent Submission Table */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800">Recent Submission</h2>
        <div className="bg-white p-4 rounded-lg shadow mt-4 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Interior Type</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading submissions...</td></tr>
              ) : recentSubmissions.length > 0 ? (
                recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{sub.id.substring(0, 6)}...</td>
                    <td className="px-6 py-4">{sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4">{sub.name}</td>
                    <td className="px-6 py-4">{sub.propertyType}</td>
                    <td className="px-6 py-4">{sub.interiorType}</td>
                    <td className="px-6 py-4"><StatusBadge status={sub.status} /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-4">No recent submissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*Tombol Tawk.to Admin Dashboard */}
      <a
        href={tawkToDashboardUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Open Tawk.to Admin Dashboard"
        className="fixed bottom-10 right-10 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-transform duration-300 hover:scale-110"
      >
        <MessageSquare size={28} />
      </a>
    </div>
  );
}