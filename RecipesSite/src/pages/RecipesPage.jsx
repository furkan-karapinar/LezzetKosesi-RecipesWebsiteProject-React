import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Search, Grid, List, SlidersHorizontal, X, ChefHat } from 'lucide-react';
import Navbar from '../components/general/Navbar';
import Footer from '../components/general/Footer';
import Hero from '../components/general/Hero';
import { RecipeCategoryApi, RecipeLikesApi } from '../api/api'; // Assuming you have an API file to fetch recipes
import LoadingOverlay from '../components/general/LoadingOverlay';
import { useSearchParams } from 'react-router-dom'; // Eğer URL parametreleri kullanacaksanız


import { UserContext } from '../contexts/UserContext'; // UserContext'i import et

import { toast, ToastContainer } from 'react-toastify'; // Eğer toast bildirimleri kullanacaksanız
import RecipePageCard from '../components/RecipePageCard'; // Tarif kartı bileşeni
import { useRecipeContext } from '../contexts/RecipeContext'; // GlobalContext'i import et


const RecipesPage = () => {

  const {
    recipeList,
    recipeCategoryList,
    fetchRecipes,
    fetchRecipeCategories,
    paginationInfo,
    hasMore,
    loading,
    page
  } = useRecipeContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);


  const buildParams = () => {
    const params = {};
    if (searchQuery.trim()) {
      params.s = searchQuery.trim();
    } else {
      if (firstLoad) {
        setFirstLoad(false);
        const urlParams = new URLSearchParams(window.location.search);
        const urlSearchQuery = urlParams.get('s');
        if (urlSearchQuery) {
          setSearchQuery(urlSearchQuery);
          params.s = urlSearchQuery;
        }
      }

    }
    if (selectedCategory !== 0) params.category = selectedCategory;
    if (selectedDifficulty !== "all") params.difficulty = selectedDifficulty;
    if (selectedTime !== "all") params.time = selectedTime;
    if (sortBy) params.sort = sortBy;
    return params;
  };

  useEffect(() => {
    fetchRecipeCategories();
  }, []);

  useEffect(() => {
    fetchRecipes(buildParams(), true, 1);
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedTime, sortBy]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchRecipes(buildParams(), false, page + 1);
    }
  };

  const {
    userRecipeLikeList, setUserRecipeLikeList,
    userRecipeBookmarkList, setUserRecipeBookmarkList,
    fetchRecipeLikes,
    fetchRecipeLikeCheck,
    fetchRecipeBookmarks,
    fetchRecipeBookmarkCheck,
    isLoggedIn,
  } = useContext(UserContext);


  const showToast = (message) => {
    toast.success(message, {
      icon: false,
      position: "bottom-right",
      style: {
        background: 'linear-gradient(to right, #e7000b, #9f0712)',
        color: '#FFFFFF',
      },
      hideProgressBar: true,
    });
  };

  const toggleFavorite = (id) => {

    if (userRecipeLikeList.includes(id)) {
      // Eğer tarif zaten beğenilmişse, beğeniyi kaldır
      setUserRecipeLikeList(prev => prev.filter(recipeId => recipeId !== id));
      showToast('Tarif beğenilenlerden çıkarıldı!');
    } else {
      // Eğer tarif beğenilmemişse, beğeniyi ekle
      setUserRecipeLikeList(prev => [...prev, id]);
      showToast('Tarif beğenilenlere eklendi!');
    }
    // Burada ayrıca API çağrısı yaparak veritabanını güncelleyebilirsiniz
    fetchRecipeLikeCheck(id);
  };

  const toggleBookmark = (id) => {
    if (userRecipeBookmarkList.includes(id)) {
      // Eğer tarif zaten beğenilmişse, beğeniyi kaldır
      setUserRecipeBookmarkList(prev => prev.filter(recipeId => recipeId !== id));
      showToast('Tarif yer imlerinden çıkarıldı!');
    } else {
      // Eğer tarif beğenilmemişse, beğeniyi ekle
      setUserRecipeBookmarkList(prev => [...prev, id]);
      showToast('Tarif yer imlerine eklendi!');
    }
    // Burada ayrıca API çağrısı yaparak veritabanını güncelleyebilirsiniz
    fetchRecipeBookmarkCheck(id);
  };

  useEffect(() => {
    if (!isLoggedIn) return; // Kullanıcı giriş yapmamışsa hiçbir şey yapma
    fetchRecipeLikes();
    fetchRecipeBookmarks();
  }, [isLoggedIn]);




  return (
    <div className="min-h-screen site_container">
      {/* Header */}
      <Navbar page_index={1} />

      {/* Page Header */}
      <Hero showSearchBar={false} title={"Lezzetli Tarifler"} description={"Lezzetli tarifleri keşfet ve favori yemeklerini bul"} />

      {loading ? <LoadingOverlay /> : ""}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tarif ara..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filtreler
            </button>
          </div>

          {/* Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isFilterOpen ? 'block' : 'hidden lg:grid'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                {recipeCategoryList.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.category_name} ({category.recipes_count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="all">Tümü</option>
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="all">Tümü</option>
                <option value="quick">30 dk ve altı</option>
                <option value="medium">30-60 dk</option>
                <option value="long">60 dk üzeri</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sırala</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="popular">Popüler</option>
                <option value="rating">Puan (Azalan)</option>
                <option value="rrating">Puan (Artan)</option>
                <option value="time">Süre (Azalan)</option>
                <option value="rtime">Süre (Artan)</option>
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-end items-center mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{paginationInfo?.totalItems}</span> tarif bulundu
          </p>

        </div>

        <ToastContainer />

        {/* Recipes Grid/List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipeList.map((recipe) => (
            <RecipePageCard
              key={recipe.id}
              recipe={recipe}
              likeList={userRecipeLikeList}
              bookmarkList={userRecipeBookmarkList}
              toggleFavorite={toggleFavorite}
              toggleBookmark={toggleBookmark}
            />
          ))}
        </div>

        {/* No Results */}
        {recipeList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Tarif bulunamadı</h3>
            <p className="text-gray-600 mb-6">Arama kriterlerinizi değiştirmeyi deneyin</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedTime('all');
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Load More */}
        {recipeList.length > 0 && hasMore && (
          <div className="text-center mt-12">
            <button onClick={loadMore} className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
              Daha Fazla Yükle
            </button>
          </div>
        )}

      </div>
      {/* End of Results */}
      {!hasMore && recipeList.length > 0 && (
        <div className="p-10 flex justify-center items-center text-gray-600">
          <ChefHat className='text-red-500 w-8 h-8' /><p className='text-xl'>&nbsp;&nbsp;Tüm tarifler gösterildi&nbsp;&nbsp;</p><ChefHat className='text-red-500 w-8 h-8' />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RecipesPage;