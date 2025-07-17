import React from "react";

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-indigo-950/70 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
    >
      {/* Container Modal*/}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white p-2 rounded-lg shadow-xl max-w-4xl max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold z-10 hover:bg-gray-200"
        >
          &times;
        </button>

        {/* Image */}
        <img
          src={image.image}
          alt={image.title}
          className="object-contain w-full h-full max-h-[85vh] rounded"
        />

        {/* Title Image */}
        <p className="text-center text-black mt-2 font-semibold">
          {image.title}
        </p>
      </div>
    </div>
  );
};

export default ImageModal;
