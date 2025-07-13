import React from 'react'
import HomePageSearchBar from './hero_comps/HomePageSearchBar';
import CategorySearchBar from './hero_comps/CategorySearchBar';

const Hero = ({ title, description, ishomepage, searchQuery, setSearchQuery, showSearchBar = true }) => {
  return (
    <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {title || "Mutfak Keyfini Keşfet!"}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-red-100">
          {description || "En lezzetli tarifler, pratik ipuçları ve mutfak sırları burada!"}
        </p>

        {/* Search Bar */}

        {showSearchBar && (
          ishomepage ? (
            <HomePageSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          ) : (
            <CategorySearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          )
        )}

      </div>
    </section>
  )
}

export default Hero