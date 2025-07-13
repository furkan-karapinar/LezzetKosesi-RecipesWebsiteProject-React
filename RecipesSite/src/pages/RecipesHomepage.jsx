import { useState, useEffect, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import Hero from '../components/general/Hero';
import Navbar from '../components/general/Navbar';
import Footer from '../components/general/Footer';
import { MainApiURL } from '../api/api'; // Assuming you have an API file to fetch recipes
import { useNavigate } from 'react-router-dom';
import LastAddedRecipesCard from '../components/LastAddedRecipesCard';
import PopularRecipesCard from '../components/PopularRecipesCard';
import LoadingOverlay from '../components/general/LoadingOverlay';
import RecipePageCard from '../components/RecipePageCard';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useUserContext } from '../contexts/UserContext';
import { toast, ToastContainer } from 'react-toastify'; // Assuming you are using react-hot-toast for notifications

const RecipesHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mostviewed, setMostViewed] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [addlast,setAddLast] = useState([]);

  const {
    recipeCategoryList,
    loading,
    fetchRecipeCategories,
    fetchMostViewedRecipes,
    fetchMostLikedRecipes,
    fetchAddLastRecipes
  } = useRecipeContext();

  const {
    userRecipeLikeList, setUserRecipeLikeList,
    userRecipeBookmarkList, setUserRecipeBookmarkList,
    fetchRecipeLikes,
    fetchRecipeLikeCheck,
    fetchRecipeBookmarks,
    fetchRecipeBookmarkCheck,
    isLoggedIn,
  } = useUserContext();

  useEffect(() => {

    fetchRecipeCategories();   // Kategorileri al

    const a = (async () => {
      setMostViewed(await fetchMostViewedRecipes())
      setMostLiked(await fetchMostLikedRecipes())
      setAddLast(await fetchAddLastRecipes())
    })
    a()
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return; // Kullanıcı giriş yapmamışsa hiçbir şey yapma
    fetchRecipeLikes();
    fetchRecipeBookmarks();
  }, [isLoggedIn]);

  const showToast = useCallback((message) => {
    toast.success(message, {
      icon: false,
      position: "bottom-right",
      style: {
        background: 'linear-gradient(to right, #e7000b, #9f0712)',
        color: '#FFFFFF',
      },
      hideProgressBar: true,
    });
  });

  const toggleFavorite = useCallback((id) => {

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
  });

  const toggleBookmark = useCallback((id) => {
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
  });


  const navigate = useNavigate();

  const handleShowAllClick = () => {
    navigate('/recipes'); // Bu, tüm tariflerin bulunduğu sayfaya yönlendirecek
  };

  return (
    <div className="min-h-screen site_container">
      {/* Header */}
      <Navbar page_index={0} />

      {/* Hero Section */}
      <Hero title={`Lezzetin Adresi`}
        description={"Binlerce enfes tarif, adım adım videolar ve mutfak ipuçları"}
        ishomepage={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}

      />

      {loading ? <LoadingOverlay /> : ""}
      <ToastContainer />
      {/* Featured Recipes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Öne Çıkan Tarifler</h2>
            <a onClick={handleShowAllClick} className="text-red-600 hover:text-red-700 font-medium flex items-center cursor-pointer">
              Tümünü Gör
              <TrendingUp className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {mostviewed.length > 0 && mostviewed
              .map((recipe) => (
                // <TrendingCard key={recipe.id} recipe={recipe} />
                <RecipePageCard key={recipe.id} recipe={recipe} likeList={userRecipeLikeList} bookmarkList={userRecipeBookmarkList} toggleBookmark={toggleBookmark} toggleFavorite={toggleFavorite} />
              ))
            }
          </div>
        </div>
      </section>

      {/* Categories */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Kategoriler</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center">
            {recipecategory.map((category, index) => (
              (category.recipes_count != 0 && category.id !=0 ? <CategoryBox key={index} category={category} /> : '')
            ))}
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white'>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Kategoriler</h2>
            <p className="text-red-100">Her kategoride ne kadar tarif var?</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recipeCategoryList
              .filter(category => category.id != 0)
              .sort((a, b) => b.recipes_count - a.recipes_count)
              .slice(0, 4)
              .map((category) => (
                <div key={category.id} className="text-center">
                  <div className="mb-3">
                    <img src={MainApiURL + category.category_icon} alt={category.category_name} className="w-16 h-16 mx-auto" />
                  </div>
                  <div className="text-red-100 text-sm">{category.category_name}</div>
                  <div className="text-2xl font-bold mb-1">{category.recipes_count}+</div>
                </div>
              ))}
          </div>

          <div className="text-center mt-8">
            <div className="text-4xl font-bold mb-2">
              {recipeCategoryList.reduce((acc, cat) => cat.id !== 0 ? acc + cat.recipes_count : acc, 0)}+
            </div>
            <div className="text-red-100">Toplam Tarif</div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Son Eklenen Tarifler</h2>
              <div className="space-y-6">
                {addlast.map((recipe) => (
                  <LastAddedRecipesCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Popüler Tarifler</h3>
              <div className="space-y-4">
                {mostLiked.map((recipe) => (
                    <PopularRecipesCard key={recipe.id} recipe={recipe} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RecipesHomepage;