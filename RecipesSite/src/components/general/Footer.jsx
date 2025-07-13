import React from 'react'
import { ChefHat } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className='flex flex-col justify-center'>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold">LezzetKöşesi</span>
            </div>
            <p className="text-gray-400">
              Mutfakta geçirdiğiniz her anı keyifli hale getiren tarifler ve ipuçları.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Anasayfa</a></li>
              <li><a href="/recipes" className="hover:text-white transition-colors">Tarifler</a></li>
              <li><a href="/blogs" className="hover:text-white transition-colors">Bloglar</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>



          <div>
            <h3 className="font-bold text-xl mb-4">Bizi Takip Et</h3>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700">
                <span className="text-sm font-bold">i</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LezzetKöşesi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer