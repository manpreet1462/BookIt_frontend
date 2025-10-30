"use client";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ExperienceCard from "./components/ExperienceCard";
import { getExperiences, Experience } from "./lib/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await getExperiences();
        setExperiences(data);
        setFilteredExperiences(data);
      } catch (err) {
        setError("Failed to load experiences");
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query === "") {
      setFilteredExperiences(experiences);
      return;
    }

    const filtered = experiences.filter((exp) => {
      const lowerQuery = query.toLowerCase();
      return (
        exp.title.toLowerCase().includes(lowerQuery) ||
        exp.location.toLowerCase().includes(lowerQuery)
      );
    });

    setFilteredExperiences(filtered);
  };

  const ExperienceSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#FFD643] text-[#161616] rounded-md hover:bg-yellow-500"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ExperienceSkeleton key={index} />
            ))}
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No experiences found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}