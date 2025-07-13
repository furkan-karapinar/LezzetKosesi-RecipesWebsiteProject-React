import React, { useEffect, useState, useCallback , useContext } from 'react';
import { Search, SlidersHorizontal,ChefHat} from 'lucide-react';
import Navbar from '../components/general/Navbar';
import Footer from '../components/general/Footer';
import Hero from '../components/general/Hero';
import BlogPageCard from '../components/BlogPageCard';
import LoadingOverlay from '../components/general/LoadingOverlay';
import { UserContext } from '../contexts/UserContext'; // UserContext'i import et
import { toast, ToastContainer } from 'react-toastify'; // Eğer toast bildirimleri kullanacaksanız
import { useBlogContext } from '../contexts/BlogContext'; // doğru path olduğundan emin ol

const BlogPage = () => {

  const {
    blogList,
    blogCategoryList,
    hasMore,
    page,
    loading,
    fetchBlogs,
    fetchBlogCategories
  } = useBlogContext();


 

  const {
    userBlogLikeList, setUserBlogLikeList,
    userBlogBookmarkList, setUserBlogBookmarkList,
    fetchBlogLikes,
    fetchBlogLikeCheck,
    fetchBlogBookmarks,
    fetchBlogBookmarkCheck,
    isLoggedIn,
  } = useContext(UserContext);


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedTime, setSelectedTime] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const buildApiParams = useCallback(() => {
    const params = {};
    if (searchQuery.trim()) params.s = searchQuery.trim();
    if (selectedCategory !== 0) params.category = selectedCategory;
    if (selectedTime !== 'all') params.time = selectedTime;
    if (sortBy !== 'none') params.sort = sortBy;
    return params;
  }, [searchQuery, selectedCategory, selectedTime, sortBy]);

  // İlk kategori verilerini çek
  useEffect(() => {
    fetchBlogCategories();
  }, []);

  // Filtre değiştiğinde baştan yükle
  useEffect(() => {
    fetchBlogs(buildApiParams(), true, 1);
  }, [buildApiParams]);

  // Daha fazla veri yükleme
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchBlogs(buildApiParams(), false, page + 1);
    }
  };

  
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
  
          if (userBlogLikeList.includes(id)) {
              // Eğer tarif zaten beğenilmişse, beğeniyi kaldır
              setUserBlogLikeList(prev => prev.filter(recipeId => recipeId !== id));
              showToast('Tarif beğenilenlerden çıkarıldı!');
          } else {
              // Eğer tarif beğenilmemişse, beğeniyi ekle
              setUserBlogLikeList(prev => [...prev, id]);
              showToast('Tarif beğenilenlere eklendi!');
          }
          // Burada ayrıca API çağrısı yaparak veritabanını güncelleyebilirsiniz
          fetchBlogLikeCheck(id);
      };
  
      const toggleBookmark = (id) => {
          if (userBlogBookmarkList.includes(id)) {
              // Eğer tarif zaten beğenilmişse, beğeniyi kaldır
              setUserBlogBookmarkList(prev => prev.filter(recipeId => recipeId !== id));
              showToast('Tarif yer imlerinden çıkarıldı!');
          } else {
              // Eğer tarif beğenilmemişse, beğeniyi ekle
              setUserBlogBookmarkList(prev => [...prev, id]);
              showToast('Tarif yer imlerine eklendi!');
          }
          // Burada ayrıca API çağrısı yaparak veritabanını güncelleyebilirsiniz
          fetchBlogBookmarkCheck(id);
      };

  
      // Beğenilen tarifleri yükle
      useEffect(() => {
          if (!isLoggedIn) return; // Kullanıcı giriş yapmamışsa hiçbir şey yapma
          fetchBlogLikes();
          fetchBlogBookmarks();
      }, [isLoggedIn]);
  

  return (
    <div className="min-h-screen site_container">
      {/* Header */}
      <Navbar page_index={2} />
      <ToastContainer/>

      {/* Hero Section */}
      <Hero title={`Lezzetli Blog`}
        description={"Yemek tarifleri, beslenme ipuçları ve daha fazlası!"}
        ishomepage={true}
        showSearchBar={false}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}

      />

      { loading ? <LoadingOverlay/> : ""}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Yazı ara..."
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
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isFilterOpen ? 'block' : 'hidden lg:grid'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                {blogCategoryList.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.category_name} ({category.blogs_count})
                  </option>
                ))}
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
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
              </select>
            </div>
          </div>

        </div>

        {/* Blog Posts */}
        <section>
          <div className='flex items-center text-center justify-end mb-8'>

            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{blogList.length}</span> tarif bulundu
            </p>
          </div>


          <div className="grid lg:grid-cols-4 gap-8">
            {blogList.map((post) => (
              <BlogPageCard key={post.id} blog={post} toggleBookmark={toggleBookmark} toggleFavorite={toggleFavorite} likeList={userBlogLikeList} bookmarkList={userBlogBookmarkList} /> // Bunu düzenle recipecard gibi olsun
            ))}
          </div>
        </section>

        {/* No Results */}
        {blogList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Yazılar bulunamadı</h3>
            <p className="text-gray-600 mb-6">Arama teriminizi değiştirmeyi deneyin</p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Aramayı Temizle
            </button>
          </div>
        )}

        {/* Load More */}
        {blogList.length > 0 && hasMore && (
          <div className="text-center mt-12">
            <button onClick={handleLoadMore} className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
              Daha Fazla Yükle
            </button>
          </div>
        )}
      </div>
      {/* End of Results */}
      {!hasMore && blogList.length > 0 && (
        <div className="p-10 flex justify-center items-center text-gray-600">
          <ChefHat className='text-red-500 w-8 h-8' /><p className='text-xl'>&nbsp;&nbsp;Tüm blog yazıları gösterildi&nbsp;&nbsp;</p><ChefHat className='text-red-500 w-8 h-8' />
        </div>
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogPage;
