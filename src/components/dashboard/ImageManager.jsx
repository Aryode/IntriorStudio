import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

// Komponen untuk mengelola gambar
export default function ImageManager({ collectionName, title }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemImage, setNewItemImage] = useState(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Mengambil data dari Firestore
  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [collectionName]);

  // Menangani penambahan item baru
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemTitle || !newItemImage) return alert("Judul dan Gambar tidak boleh kosong.");
    if (!CLOUD_NAME || !UPLOAD_PRESET) return alert("Konfigurasi Cloudinary tidak ditemukan.");
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', newItemImage);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.secure_url) {
        await addDoc(collection(db, collectionName), {
          title: newItemTitle,
          imageUrl: data.secure_url,
          createdAt: serverTimestamp(),
        });
        
        setNewItemTitle('');
        setNewItemImage(null);
        setShowAddModal(false);
      } else {
        throw new Error(data.error.message || 'Gagal mengunggah ke Cloudinary.');
      }
    } catch (error) {
      console.error(`Error adding item to ${collectionName}:`, error);
      alert(`Gagal menambah item: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Menangani penghapusan item
  const handleDeleteItem = async (item) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${item.title}"?`)) {
      try {
        await deleteDoc(doc(db, collectionName, item.id));
      } catch (error) {
        console.error(`Error deleting item from ${collectionName}:`, error);
        alert("Gagal menghapus item.");
      }
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
            <p className="col-span-full text-center text-gray-500">Loading...</p>
        ) : items.length > 0 ? (
            items.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                    <div className="relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteItem(item)} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg">
                        <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                    </div>
                    <div className="p-3">
                    <h3 className="font-semibold text-gray-800 truncate" title={item.title}>{item.title}</h3>
                    </div>
                </div>
            ))
        ) : (
            <p className="col-span-full text-center text-gray-500">Belum ada data. Silakan tambahkan.</p>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in-0 zoom-in-95">
            <form onSubmit={handleAddItem}>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New {title}</h2>
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul</label>
                    <input type="text" id="title" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Gambar</label>
                    <input type="file" id="image" onChange={(e) => setNewItemImage(e.target.files[0])} required accept="image/jpeg, image/png" className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"/>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isUploading}>Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center min-w-[120px] justify-center" disabled={isUploading}>
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};