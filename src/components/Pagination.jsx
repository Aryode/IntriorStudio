import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Membuat array nomor halaman, misalnya [1, 2, 3, 4, 5]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Jika total halaman lebih dari 5, kita hanya akan menampilkan 5 nomor halaman
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return pageNumbers;
    }
    
    const visiblePages = [];
    if (currentPage <= 3) {
      // Jika di awal: 1, 2, 3, 4, 5
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      // Jika di akhir: (total - 4), (total - 3), ..., total
      return pageNumbers.slice(totalPages - 5);
    } else {
      // Jika di tengah: (saat ini - 2), ..., (saat ini + 2)
      return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  };

  const visiblePageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center mt-10 md:mt-12 space-x-1 sm:space-x-2">
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      {/* Nomor Halaman */}
      {visiblePageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 text-sm font-medium border rounded-md ${
            currentPage === number 
            ? 'bg-indigo-600 text-white border-indigo-600' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {number}
        </button>
      ))}

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
