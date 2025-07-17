import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import ImageGalleryModal from '../components/ImageGalleryModal';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const GalleryPage = () => {
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mengambil data dari koleksi "gallery"
  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllImages(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = allImages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allImages.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  
  const openModal = (imageId) => {
    const globalIndex = allImages.findIndex(img => img.id === imageId);
    setSelectedImageIndex(globalIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const showNextImage = () => setSelectedImageIndex(prev => Math.min(prev + 1, allImages.length - 1));
  const showPrevImage = () => setSelectedImageIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="bg-white min-h-screen pt-28 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Spaces We've Transformed</h1>
        <p className="text-lg md:text-xl mt-2 text-gray-600">Ready for a transformation? Find your inspiration right here.</p>

        <div className="bg-gray-100 rounded-[20px] p-4 sm:p-6 md:p-8 mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              <p className="col-span-full text-center">Loading gallery...</p>
            ) : (
              currentImages.map(image => (
                <div
                  key={image.id}
                  onClick={() => openModal(image.id)}
                  className="h-40 sm:h-48 rounded-md overflow-hidden shadow-md group cursor-pointer"
                >
                  <img 
                    src={image.imageUrl} 
                    alt={image.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <ImageGalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={showNextImage}
        onPrev={showPrevImage}
        hasNext={selectedImageIndex < allImages.length - 1}
        hasPrev={selectedImageIndex > 0}
        imageSrc={allImages[selectedImageIndex]?.imageUrl}
        imageTitle={allImages[selectedImageIndex]?.title}
      />
    </div>
  );
};

export default GalleryPage;