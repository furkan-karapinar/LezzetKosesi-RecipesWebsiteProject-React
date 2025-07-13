import React from 'react'
import { MainApiURL } from '../api/api'
import { Eye, Heart } from 'lucide-react'

const PopularRecipesCard = ({ recipe }) => {
    return (
        <a href={`recipes/${recipe.id}`} key={recipe.id} className="flex items-center space-x-3 p-3 bg-white rounded-xl text-gray-900 hover:text-red-500 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <img
                src={MainApiURL + recipe.image}
                alt={recipe.title}
                className="w-17 h-17 rounded-lg object-cover"
            />
            <div className="flex-1">
                <h4 className="font-medium ">{recipe.title}</h4>
                <p className="text-sm text-gray-500">{recipe.description}</p>
            
                <div className='flex items-center space-x-1 py-2 text-sm text-gray-500'>
                    <div className='flex items-center space-x-1'>
                        <Heart className="inline w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{recipe.like_count}</span>
                    </div>
                    <span className="text-gray-400">&nbsp;|&nbsp;</span>
                    <div className='flex items-center space-x-1'>
                        <Eye className="inline w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{recipe.view_count}</span>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default PopularRecipesCard