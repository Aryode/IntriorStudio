import React, { useState } from 'react';
import ImageManager from './ImageManager';

export default function ProjectManagement() {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project & Gallery Management</h1>
      
      {/* Tombol Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('projects')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'projects'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Featured Projects (Homepage)
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'gallery'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Gallery Page Images
          </button>
        </nav>
      </div>

      {/* Konten Tab */}
      <div>
        {/* Gunakan komponen ImageManager di sini */}
        {activeTab === 'projects' && (
          <ImageManager 
            collectionName="projects" 
            title="Featured Projects" 
          />
        )}
        {activeTab === 'gallery' && (
          <ImageManager 
            collectionName="gallery" 
            title="Gallery Images" 
          />
        )}
      </div>
    </div>
  );
}