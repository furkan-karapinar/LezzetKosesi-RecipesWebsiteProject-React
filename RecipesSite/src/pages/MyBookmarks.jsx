import React, { useState, useEffect, useContext } from 'react';
import { Search, SlidersHorizontal, ChefHat, Bookmark, Clock, Users, Star } from 'lucide-react';
import Navbar from '../components/general/Navbar';
import Footer from '../components/general/Footer';
import Hero from '../components/general/Hero';
import { MainApiURL } from '../api/api'; // Assuming you have an API file to fetch recipes
import LoadingOverlay from '../components/general/LoadingOverlay';
import { UserContext } from '../contexts/UserContext'; // UserContext'i import et
import { toast, ToastContainer } from 'react-toastify'; // Eğer toast bildirimleri kullanacaksanız
import { useRecipeContext } from '../contexts/RecipeContext'; // GlobalContext'i import et
import { useBlogContext } from '../contexts/BlogContext';


const MyBookmarks = () => {

  const {
    recipeCategoryList,
    fetchRecipeCategories,

  } = useRecipeContext();

  const {
    blogCategoryList,
    fetchBlogCategories
  } = useBlogContext();

  const [paginationInfo, setPaginationInfo] = useState({});
  const [hasMore, setHasMore] = useState(true); // Daha fazla tarif olup olmadığını kontrol etmek için
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(true); // Aktif sekmeyi tutmak için -- true: Tarifler, false: Bloglar

  const { fetchUserBookmarkRecipes, user,
    userRecipeBookmarkList, setUserRecipeBookmarkList,
    fetchRecipeBookmarks, fetchRecipeBookmarkCheck,
    fetchUserBookmarkBlogs, userBlogBookmarkList, setUserBlogBookmarkList,
    fetchBlogBookmarkCheck, fetchUserBookmarkBlogCheck, fetchBlogBookmarks
  } = useContext(UserContext); // UserContext'ten fonksiyonları al

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [recipeList, setRecipeList] = useState([]); // Tarif listesini tutacak state
  const [error, setError] = useState(false); // Hata durumunu tutacak state
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearchQuery("")
    setSelectedCategory(0)
    setSelectedDifficulty('all')
    setSelectedTime('all')
    setSortBy(activeTab ? 'popular': 'newest')
    setPage(1)
  },[activeTab])

  useEffect(() => {
    if (user) {
      try {
        setLoading(true)
        const a = async () => {
          const data = activeTab ? await fetchUserBookmarkRecipes(user?.id, 1, searchQuery, selectedDifficulty, selectedCategory, selectedTime, sortBy) : await fetchUserBookmarkBlogs(user?.id, 1, searchQuery, selectedCategory, selectedTime, sortBy);
          if (data.status == 'error') {
            setError(true);
            return;
          } else {
            setRecipeList(data.recipes);
            setPaginationInfo(data.pagination);
            if (user) { activeTab ? fetchRecipeBookmarks() : fetchBlogBookmarks() }
            setError(false);
          }

        };
        activeTab ? fetchRecipeCategories() : fetchBlogCategories(); // Kategorileri yükle
        a();
      }
      catch {
        setError(true)
      }
      finally {
        setLoading(false)
      }

    }
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedTime, sortBy, user, activeTab]);

  const loadMore = () => {
    if (!loading && hasMore) {
      try {
        setLoading(true)
        const a = async () => {
          const data = activeTab ? await fetchUserBookmarkRecipes(user?.id, page + 1, searchQuery, selectedDifficulty, selectedCategory, selectedTime, sortBy) : await fetchUserBookmarkBlogs(user?.id, page + 1, searchQuery, selectedCategory, selectedTime, sortBy);
          if (data.status == 'error') {
            setError(true);
            return;
          }
          else {
            setRecipeList(prev => [...prev, ...data.recipes]);
            setPaginationInfo(data.pagination);
            if (user) { activeTab ? fetchRecipeBookmarks() : fetchBlogBookmarks() }
            setPage(page + 1)
            setError(false);
          }

        };
        a();
      }
      catch {
        setError(true)
      }
      finally {
        setLoading(false)
      }

    }
  };

  useEffect(() => {
    setHasMore(paginationInfo.totalItems > recipeList.length);
  }, [recipeList, paginationInfo]);


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

  const toggleBookmark = (id) => {
    if (activeTab === true) {
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
      activeTab ? fetchRecipeBookmarkCheck(id) : fetchUserBookmarkBlogCheck(id);
    }
    else {
      if (userBlogBookmarkList.includes(id)) {
        // Eğer blog zaten beğenilmişse, beğeniyi kaldır
        setUserBlogBookmarkList(prev => prev.filter(blogId => blogId !== id));
        showToast('Blog yer imlerinden çıkarıldı!');
      } else {
        // Eğer blog beğenilmemişse, beğeniyi ekle
        setUserBlogBookmarkList(prev => [...prev, id]);
        showToast('Blog yer imlerine eklendi!');
      }
      // Burada ayrıca API çağrısı yaparak veritabanını güncelleyebilirsiniz
      fetchBlogBookmarkCheck(id);
    }

  };




  return (
    <div className="min-h-screen site_container">
      {/* Header */}
      <Navbar page_index={1} />

      {/* Page Header */}
      <Hero showSearchBar={false} title={"Kaydettiğim Lezzetler ve Bloglar"} description={"Tüm keşfettiğin içerikler burada"} />

      {loading ? <LoadingOverlay /> : ""}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div class=" bg-white rounded-t-2xl">
          <nav class="flex space-x-8 px-6">

            <button onClick={() => {setActiveTab(true)}} class={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab ? `border-red-600 text-red-500 hover:text-red-700` : `border-transparent text-gray-500 hover:text-gray-700`}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark w-4 h-4" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z">
                </path>
              </svg>
              <span>Kaydedilen Tarifler</span>
            </button>
            <button onClick={() => {setActiveTab(false)}} class={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${!activeTab ? `border-red-600 text-red-500 hover:text-red-700` : `border-transparent text-gray-500 hover:text-gray-700`}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark w-4 h-4" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z">
                </path>
              </svg>
              <span>Kaydedilen Bloglar</span>
            </button>
          </nav>
        </div>
        <div className="bg-white rounded-b-2xl shadow-lg p-6 mb-8">
          <div>
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
            <div className={`grid grid-cols-1 md:grid-cols-${activeTab ? '4' : '3'} gap-4 ${isFilterOpen ? 'block' : 'hidden lg:grid'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                >
                  {activeTab ? (recipeCategoryList.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))) : (blogCategoryList.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  )))}
                </select>
              </div>

              {activeTab && (<div>
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
              </div>)}

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
                  { activeTab &&(<option value="popular">Popüler</option>)}
                  { activeTab && (<option value="rating">Puan (Azalan)</option>)}
                  { activeTab && (<option value="rrating">Puan (Artan)</option>)}
                  <option value="time">Süre (Azalan)</option>
                  <option value="rtime">Süre (Artan)</option>
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex justify-end items-center m-4">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{!error ? paginationInfo.totalItems : 0}</span> tarif bulundu
            </p>

          </div>

          <ToastContainer />

          {/* Recipes Grid/List */}
          {
            !error ? (<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {recipeList.map((recipe) => (

                <div key={recipe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="relative">
                    <img
                      src={MainApiURL + recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />


                    <div className='absolute top-4 right-4 flex flex-col space-y-2'>
                      <button onClick={() => toggleBookmark(recipe.id)}
                        className=" bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                        <Bookmark className={`w-5 h-5 ${(activeTab ? userRecipeBookmarkList.includes(recipe.id) : userBlogBookmarkList.includes(recipe.id)) ? 'text-yellow-600 fill-current' : 'text-gray-600'}`} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      { activeTab ? recipe.difficulty : recipe.category_name}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-shrink-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{recipe.description}</p>
                      <p className="text-gray-500 text-xs mb-3">Ekleyen: {recipe.author_fullname}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {recipe.reading_time} dakika
                        </div>
                        {activeTab && (<div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {recipe.servings} kişilik
                        </div>)}
                        {activeTab && (<div className="flex items-center">
                          {recipe.average_rating != 0 && (<Star className="w-4 h-4 mr-1 text-yellow-500" />)}
                          {recipe.average_rating != 0 && recipe.average_rating}
                        </div>)}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <a href={`${activeTab ? 'recipes' : 'blogs'}/${recipe.id}`} className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium w-full text-center block'>
                        {activeTab ? ('Tarifi Gör') : ('Blogu Gör')}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>)
              : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Tarif bulunamadı</h3>
                  <p className="text-gray-600 mb-6">Arama kriterlerinizi değiştirmeyi deneyin</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('0');
                      setSelectedDifficulty('all');
                      setSelectedTime('all');
                    }}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              )

          }
          {/* Load More */}
          {recipeList.length > 0 && hasMore && (
            <div className="text-center mt-12">
              <button onClick={loadMore} className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Daha Fazla Yükle
              </button>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && recipeList.length > 0 && (
            <div className="p-10 flex justify-center items-center text-gray-600">
              <ChefHat className='text-red-500 w-8 h-8' /><p className='text-xl'>&nbsp;&nbsp;Tüm { activeTab ? 'tarifler' : 'bloglar' } gösterildi&nbsp;&nbsp;</p><ChefHat className='text-red-500 w-8 h-8' />
            </div>
          )}
        </div>
      </div>



      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyBookmarks;