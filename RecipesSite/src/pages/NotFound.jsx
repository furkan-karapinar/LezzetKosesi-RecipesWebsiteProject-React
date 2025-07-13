import React, { useState } from 'react';
import { Search, Home, ChefHat, Clock, Star, ArrowLeft, RefreshCw, Coffee } from 'lucide-react';
import Navbar from '../components/general/Navbar';

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const suggestedRecipes = [
    {
      id: 1,
      title: "Kremalı Mantar Çorbası",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
      time: "20 dakika",
      rating: 4.8
    },
    {
      id: 2,
      title: "Çikolatalı Brownie",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop",
      time: "35 dakika",
      rating: 4.9
    },
    {
      id: 3,
      title: "Tavuklu Caesar Salata",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
      time: "15 dakika",
      rating: 4.7
    }
  ];

  const quickLinks = [
    { name: "Ana Yemekler", count: 124 },
    { name: "Tatlılar", count: 89 },
    { name: "Çorbalar", count: 67 },
    { name: "Salatalar", count: 45 }
  ];

  return (
     <div className="min-h-screen site_container">
      {/* Header */}
      <Navbar page_index={-1} />

      {/* Main 404 Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-12">
            <div className="relative inline-block">
              <div className="text-9xl font-bold text-red-500 select-none">404</div>
              {/* Belki bir resim eklenebilir */}
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Oops! Bu lezzet <span className="text-red-600">kayıp</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Aradığınız sayfa bulunamadı. Belki taşındı veya silindiği için artık mevcut değil, 
              ya da yanlış bir bağlantıya tıkladınız. Merak etmeyin, size yardımcı olalım!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={() => window.location.href = "/"} className="bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-lg font-medium shadow-lg">
              <Home className="w-6 h-6" />
              <span>Anasayfaya Dön</span>
            </button>
            
            <button onClick={() => window.history.back()} className="bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-lg font-medium border-2 border-gray-200">
              <ArrowLeft className="w-6 h-6" />
              <span>Geri Git</span>
            </button>

            <button onClick={() => window.location.reload()} className="bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-lg font-medium border-2 border-gray-200">
              <RefreshCw className="w-6 h-6" />
              <span>Yenile</span>
            </button>
          </div>

        </div>

        {/* Help Section */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Hala Yardıma İhtiyacın Var mı?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Aradığınızı bulamadıysanız, bizimle iletişime geçin. Size en iyi tarifleri bulmakta yardımcı olmaktan mutluluk duyarız.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={ () => window.location.href = "/contact"} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
              İletişime Geç
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="w-8 h-8 text-red-600" />
                <span className="text-2xl font-bold">LezzetKöşesi</span>
              </div>
              <p className="text-gray-400">
                Mutfakta geçirdiğiniz her anı keyifli hale getiren tarifler ve ipuçları.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tarifler</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kategoriler</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Tarifler</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mutfak İpuçları</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Bizi Takip Et</h3>
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
    </div>
  );
};

export default NotFoundPage;