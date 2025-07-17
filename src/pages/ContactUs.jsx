import { useState, useEffect } from "react";
import { X } from "lucide-react";
import pageContact from "../assets/pageContact.jpg";
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactUs() {
  const [showModal, setShowModal] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [interiorType, setInteriorType] = useState("");

  const initialFormData = {
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    rooms: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Modifikasi fungsi handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !propertyType || !interiorType) {
      alert("Please select Property Type and Interior Type.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      // Siapkan data untuk dikirim ke Firestore
      const submissionData = {
        ...formData,
        propertyType: propertyType,
        interiorType: interiorType,
        status: "New", // Status awal untuk setiap submisi baru
        submittedAt: serverTimestamp(), // Tanggal dan waktu saat ini
      };

      // Simpan data ke koleksi 'formSubmissions'
      await addDoc(collection(db, "formSubmissions"), submissionData);

      setSubmissionStatus("success");
      setTimeout(() => {
        setShowModal(false);
        setFormData(initialFormData);
        setPropertyType("");
        setInteriorType("");
        setSubmissionStatus(null);
      }, 2000);

    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
  };

  const openLiveChat = () => {
    if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
      window.Tawk_API.maximize();
    } else {
      console.error("Tawk.to API not available or loaded yet.");
    }
  };

  return (
    <>
      {/* ... sisa JSX tidak berubah ... */}
       <div
        id="contact"
        className="w-full bg-slate-50 flex items-center justify-center px-4 py-16 sm:px-8 lg:px-12 min-h-[900px]"
      >
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-indigo-50 p-12 lg:p-16 flex flex-col justify-center shadow-xl rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-indigo-900 mb-4">
              Let's get in touch!
            </h1>
            <p className="text-lg text-slate-700 mb-10">
              Got question about the design interior? Our team is here to help.
            </p>

            <div className="space-y-4 max-w-md">
              <button
                onClick={openLiveChat}
                className="block text-center w-full bg-indigo-400 text-white py-4 px-4 rounded-xl text-lg font-medium hover:bg-indigo-500 transition-all duration-300 shadow-md"
              >
                Have Questions? Chat Now
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="block text-center w-full bg-indigo-600 text-white py-4 px-4 rounded-xl text-lg font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg"
              >
                Request Our Services
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 shadow-xl rounded-3xl overflow-hidden">
            <img
              src={pageContact}
              alt="Modern living room interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Modal application*/}
      {showModal && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 overflow-y-auto p-4 bg-gray-900/60 backdrop-blur-md"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">
                Application Form
              </h2>
              <p className="text-sm text-slate-600">
                Please fill out the form to request our interior design
                services.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-semibold text-left mb-3 text-indigo-800">
                  Interior Detail
                </h3>
                <p className="text-sm text-left mb-1 text-indigo-700 font-medium">
                  Property Type:
                </p>
                <div className="flex justify-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPropertyType("Home")}
                    className={`px-6 py-2 w-1/2 rounded-md transition ${
                      propertyType === "Home"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyType("Apartment")}
                    className={`px-6 py-2 w-1/2 rounded-md transition ${
                      propertyType === "Apartment"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    Apartment
                  </button>
                </div>

                <p className="text-sm text-left mb-1 text-indigo-700 font-medium">
                  Interior Type:
                </p>
                <div className="flex justify-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setInteriorType("Desain Interior")}
                    className={`px-6 py-2 w-1/2 rounded-md transition ${
                      interiorType === "Desain Interior"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    Desain Interior
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteriorType("Kitchen Set")}
                    className={`px-6 py-2 w-1/2 rounded-md transition ${
                      interiorType === "Kitchen Set"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    Kitchen Set
                  </button>
                </div>

                {interiorType === "Desain Interior" && (
                  <select
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white placeholder:text-slate-400"
                  >
                    <option value="">Number of Rooms to Design</option>
                    <option value="1 Room">1 Room</option>
                    <option value="2 Rooms">2 Rooms</option>
                    <option value="3 Rooms">3 Rooms</option>
                    <option value="More than 3 rooms">More than 3 rooms</option>
                  </select>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-indigo-800">
                  Contact Information
                </h3>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  type="text"
                  className="w-full p-3 border border-slate-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white placeholder:text-slate-400"
                  required
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number (WhatsApp)"
                  type="tel"
                  className="w-full p-3 border border-slate-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white placeholder:text-slate-400"
                  required
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email (Optional)"
                  type="email"
                  className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-indigo-800">
                  Address Information
                </h3>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full Address"
                  type="text"
                  className="w-full p-3 border border-slate-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white placeholder:text-slate-400"
                  required
                />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional Notes"
                  rows="2"
                  className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white placeholder:text-slate-400"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
                {submissionStatus === "success" && (
                  <p className="text-center mt-4 text-green-600 font-medium">
                    Application submitted successfully! We will contact you
                    soon.
                  </p>
                )}
                {submissionStatus === "error" && (
                  <p className="text-center mt-4 text-red-600 font-medium">
                    An error occurred. Please try again.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
