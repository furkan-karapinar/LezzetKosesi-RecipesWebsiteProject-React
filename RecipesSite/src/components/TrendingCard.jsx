import React from 'react'
import { Star, Clock, Heart } from 'lucide-react'
import { MainApiURL } from '../api/api'

const TrendingCard = ({ recipe }) => {
    return (
        <div key={recipe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
            <div className="relative">
                <img
                    src={MainApiURL + recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-600 cursor-pointer" />
                </div> */} 
                <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {recipe.difficulty}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {recipe.reading_time} dakika
                        </div>
                        <div className="flex items-center">
                            { recipe.average_rating != 0 && (<Star className="w-4 h-4 mr-1 text-yellow-500" />)}
                            {recipe.average_rating != 0 && recipe.average_rating}
                        </div>
                    </div>

                    <a href={`recipes/${recipe.id}`} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                        Tarife Git
                    </a>
                </div>
            </div>
        </div>
    )
}

export default TrendingCard