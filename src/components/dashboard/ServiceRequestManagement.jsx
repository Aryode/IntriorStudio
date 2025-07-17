import React, { useState, useEffect } from 'react';
import { Edit, Info, Trash2, X } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const statusOptions = ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'];

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

export default function ServiceRequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk setiap modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Mengambil data dari Firestore 
  useEffect(() => {
    const q = collection(db, "formSubmissions");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsData = [];
      querySnapshot.forEach((doc) => {
        requestsData.push({ id: doc.id, ...doc.data() });
      });
      setRequests(requestsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi untuk membuka modal Edit
  const handleOpenEditModal = (request) => {
    setEditingRequest(request);
    setShowEditModal(true);
  };

  // 3. Fungsi baru untuk membuka modal Detail
  const handleOpenDetailsModal = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  // Fungsi untuk menyimpan perubahan status (tidak berubah)
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editingRequest) return;
    const newStatus = e.target.status.value;
    const requestDocRef = doc(db, "formSubmissions", editingRequest.id);
    try {
      await updateDoc(requestDocRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status: ", error);
    } finally {
      setShowEditModal(false);
      setEditingRequest(null);
    }
  };

  // 4. Fungsi baru untuk menghapus data
  const handleDeleteRequest = async (requestId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini secara permanen? Aksi ini tidak bisa dibatalkan.")) {
        try {
            await deleteDoc(doc(db, "formSubmissions", requestId));
            setShowEditModal(false); // Tutup modal edit setelah berhasil hapus
            setEditingRequest(null);
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("Gagal menghapus data.");
        }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Service Request Management</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mt-6 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Property</th>
              <th className="px-6 py-3">Status</th>
              {/* 5. Tambah kolom baru untuk Detail */}
              <th className="px-6 py-3 text-center">Details</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-4">Loading data...</td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{req.id.substring(0, 6)}...</td>
                  <td className="px-6 py-4">{req.submittedAt ? new Date(req.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4">{req.name}</td>
                  <td className="px-6 py-4">{req.phone}</td>
                  <td className="px-6 py-4">{req.propertyType}</td>
                  <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                  {/* 6. Tambah tombol Detail */}
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleOpenDetailsModal(req)} className="text-gray-500 hover:text-blue-600">
                      <Info className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleOpenEditModal(req)} className="text-gray-500 hover:text-indigo-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center py-4">No service requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 7. Modal baru untuk menampilkan detail lengkap */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Submission Details</h2>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24}/>
                </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
                {Object.entries(selectedRequest).map(([key, value]) => {
                    // Jangan tampilkan ID dan format tanggal
                    if (key === 'id') return null;
                    if (key === 'submittedAt') {
                        value = new Date(value.seconds * 1000).toLocaleString();
                    }
                    return (
                        <div key={key} className="grid grid-cols-3 gap-4">
                            <span className="font-semibold text-gray-600 capitalize col-span-1">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="text-gray-800 col-span-2">{value.toString() || "-"}</span>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Request */}
      {showEditModal && editingRequest && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <form onSubmit={handleSaveChanges}>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Request</h2>
                <p className="text-sm text-gray-500">ID: {editingRequest.id.substring(0,6)}...</p>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 font-semibold text-gray-900">{editingRequest.name}</p>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Change Status</label>
                    <select id="status" name="status" defaultValue={editingRequest.status} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900">
                      {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {/* 8. Modifikasi footer modal edit */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <button 
                    type="button" 
                    onClick={() => handleDeleteRequest(editingRequest.id)} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
                <div className="flex gap-4">
                    <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}