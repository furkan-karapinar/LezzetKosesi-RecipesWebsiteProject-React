import React from 'react'
import { Search } from 'lucide-react'

const HomePageSearchBar = ({searchQuery,setSearchQuery}) => {
    return (
        <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white rounded-full shadow-lg">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                    type="text"
                    placeholder="Hangi tarifi arıyorsun?"
                    className="flex-1 px-4 py-4 text-gray-900 rounded-full focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <a href={`/recipes?s=${searchQuery}`} className="bg-red-600 text-white px-6 py-4 rounded-full hover:bg-red-700 transition-colors">
                    Ara
                </a>
            </div>
        </div>
    )
}

export default HomePageSearchBar