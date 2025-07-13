import React from 'react'
import { MainApiURL } from '../api/api'
import { Heart, Bookmark, Clock, Users, Star } from 'lucide-react'

const RecipePageCard = ({ recipe, likeList, bookmarkList, toggleBookmark, toggleFavorite }) => {
    if (!recipe) return null;   
    return (
        <div key={recipe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="relative">
                <img
                    src={MainApiURL + recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />


                <div className='absolute top-4 right-4 flex flex-col space-y-2'>
                    <button onClick={() => toggleFavorite(recipe.id)}
                        className=" bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                        <Heart className={`w-5 h-5 ${likeList.includes(recipe.id) ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
                    </button>

                    <button onClick={() => toggleBookmark(recipe.id)}
                        className=" bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors" >
                        <Bookmark className={`w-5 h-5 ${bookmarkList.includes(recipe.id) ? 'text-yellow-600 fill-current' : 'text-gray-600'}`} />
                    </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {recipe.difficulty}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">{recipe.description}</p>
                    {console.log(recipe)}
                    <p className="text-gray-500 text-xs mb-3">Ekleyen: {recipe.author_fullname}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {recipe.reading_time} dakika
                        </div>
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {recipe.servings} kişilik
                        </div>
                        <div className="flex items-center">
                            {recipe.average_rating != 0 && (<Star className="w-4 h-4 mr-1 text-yellow-500" />)}
                            {recipe.average_rating != 0 && recipe.average_rating}
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <a href={`recipes/${recipe.id}`} className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium w-full text-center block'>
                        Tarifi Gör
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RecipePageCard