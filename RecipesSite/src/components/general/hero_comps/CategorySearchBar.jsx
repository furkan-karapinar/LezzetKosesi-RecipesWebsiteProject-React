import React from 'react'
import { Search } from 'lucide-react';

const CategorySearchBar = ({searchQuery,setSearchQuery}) => {
    return (
        <div className="max-w-md mx-auto relative">
            <div className="flex items-center bg-white rounded-full shadow-lg">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <input
                    type="text"
                    placeholder="Kategori ara..."
                    className="flex-1 px-4 py-3 text-gray-900 rounded-full focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    )
}

export default CategorySearchBar