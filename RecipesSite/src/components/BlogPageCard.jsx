import React from 'react'
import { Clock, ArrowRight, Heart, Bookmark, Users, Star } from 'lucide-react';
import { MainApiURL } from '../api/api';

const BlogPageCard = ({ blog, likeList, bookmarkList, toggleBookmark, toggleFavorite }) => {
    return (
        <div key={blog.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="relative">
                <img
                    src={MainApiURL + blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className='absolute top-4 right-4 flex flex-col space-y-2'>
                    <button onClick={() => toggleFavorite(blog.id)}
                        className=" bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                        <Heart className={`w-5 h-5 ${likeList.includes(blog.id) ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
                    </button>

                    <button onClick={() => toggleBookmark(blog.id)}
                        className=" bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors" >
                        <Bookmark className={`w-5 h-5 ${bookmarkList.includes(blog.id) ? 'text-yellow-600 fill-current' : 'text-gray-600'}`} />
                    </button>
                </div>

                <div className='absolute flex bottom-4 left-4 flex-wrap'>
                    {
                        <div key={blog.category_id} className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2">
                            {blog.category_name}
                        </div>
                    }
                </div>

            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">{blog.description}</p>
                    <p className="text-gray-500 text-sm mb-3">Yazar: {blog.author_fullname}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {blog.reading_time} dakika
                        </div>

                    </div>
                </div>

                <div className="mt-auto">
                    <a href={`blogs/${blog.id}`} className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium w-full text-center block'>
                        Detaylar <ArrowRight className="inline w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default BlogPageCard