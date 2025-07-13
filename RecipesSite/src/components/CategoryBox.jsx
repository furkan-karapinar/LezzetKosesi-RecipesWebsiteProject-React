import React from 'react'
import { MainApiURL } from '../api/api'

const CategoryBox = ({ category }) => {
    return (
        <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-red-50 hover:border-red-200 border-2 border-transparent transition-all duration-300 cursor-pointer group">
            <div className="mb-3">
                <img src={MainApiURL + category.category_icon_path} alt={category.category_name} className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600">{category.category_name}</h3>
            <p className="text-sm text-gray-500">{category.recipe_count} tarif</p>
        </div>
    )
}

export default CategoryBox