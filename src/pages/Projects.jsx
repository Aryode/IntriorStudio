import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageModal from "../components/ImageModal";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebase";

const Projects = () => {
  const [projectImages, setProjectImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = querySnapshot.docs.map((doc, index) => {
        const project = { id: doc.id, ...doc.data() };
        // Logika untuk mempertahankan layout Bento Grid
        if (index === 0 || index === 9) {
            project.className = "col-span-2 row-span-1";
        } else {
            project.className = "col-span-1 row-span-1";
        }
        return project;
      });
      setProjectImages(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openModal = (project) => {
    setSelectedImage({ image: project.imageUrl, title: project.title });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="bg-slate-50">
      <div id="projects" className="bg-indigo-950 text-white pt-20 pb-20 rounded-tl-[80px] rounded-tr-[80px] md:rounded-tl-[120px] md:rounded-tr-[120px]">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <h1 className="text-5xl font-bold">Our Projects</h1>
          <p className="text-xl mt-4 text-white">
            Explore our collection of stunning interior design projects
          </p>
        </div>
      </div>

      <div className="bg-indigo-950">
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-white col-span-full text-center">Loading projects...</p>
            ) : (
              projectImages.map((project) => (
                <div
                  key={project.id}
                  onClick={() => openModal(project)}
                  className={`${project.className} rounded-2xl overflow-hidden cursor-pointer h-52 group relative`}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-0 left-0 p-5">
                      <h3 className="text-white font-semibold text-xl">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/gallery")}
              className="inline-block bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full"
            >
              Discover More Designs
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <ImageModal image={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default Projects;