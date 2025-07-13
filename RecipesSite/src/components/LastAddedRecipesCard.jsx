import React from 'react'
import { Clock, Play, Users } from 'lucide-react'
import { MainApiURL } from '../api/api'

const LastAddedRecipesCard = ({recipe}) => {
  return (
    <a href={`recipes/${recipe.id}`} key={recipe.id} className="bg-white text-gray-900 hover:text-red-600 rounded-2xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow">
                    <img
                      src={MainApiURL + recipe.image}
                      alt="Recipe"
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold  mb-1">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{recipe.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {recipe.reading_time} dakika
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {recipe.servings} kişilik
                        </span>
                      </div>
                    </div>
                    <div>
                    <Play className="w-6 h-6 text-red-600" />
                    </div>
                  </a>
  )
}

export default LastAddedRecipesCard