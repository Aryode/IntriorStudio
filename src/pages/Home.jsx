import { useState } from "react";
import showCase from "../assets/showcase.jpg";

const Home = () => {
  const [location] = useState("Jakarta, Indonesia");
  const [projectType] = useState("Residential");

  return (
    <div id="home" className="min-h-screen bg-slate-50 pt-16">
      <main className="container mx-auto px-6 py-12">
        {/* Main Container */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-full md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Live Beautifully in Your{" "}
              <span className="text-indigo-500">Dream Space</span>
            </h1>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-slate-600 mb-6 font-medium">
              Transforms homes into sanctuaries with classic design elements,
              personal touches, and uplifting interiors with IntriorStudio
            </p>
            <div className="flex space-x-4">
              <a
                href="#contact"
                className="bg-indigo-500 hover:bg-indigo-600 !text-white py-2 px-6 rounded-md font-medium"
              >
                Get Started
              </a>
              <a
                href="#projects"
                className="bg-blue-400 hover:bg-blue-500 !text-white py-2 px-6 rounded-md font-medium border border-slate-300"
              >
                Explore Project
              </a>
            </div>
          </div>
        </div>

        {/* Image Home Container*/}
        <div className="relative mt-24 mb-32">
          <div className="w-full h-80 rounded-xl overflow-hidden">
            <img
              src={showCase}
              alt="Interior design showcase"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl">
            <div className="flex justify-center">
              <div className="flex w-full max-w-2xl justify-between gap-6">
                {/* Location */}
                <div className="flex flex-col">
                  <label className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    Project Location
                  </label>
                  <p className="text-sm font-medium text-slate-800">
                    {location}
                  </p>
                </div>

                {/* Project Information */}
                <div className="flex flex-col">
                  <label className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                    Project Type
                  </label>
                  <p className="text-sm font-medium text-slate-800">
                    {projectType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
