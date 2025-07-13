import React, { useState, useContext, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Share2,
    Eye,
    Clock,
    Users,
    Star,
    Heart,
    ChefHat,
    AlertTriangle
} from 'lucide-react';
import Hero from '../components/general/Hero';
import Navbar from '../components/general/Navbar';
import { UserContext } from '../contexts/UserContext';
import { RecipeContext } from '../contexts/RecipeContext';
import { MainApiURL } from '../api/api';
import { toast, ToastContainer } from 'react-toastify'; // Eğer toast bildirimleri kullanacaksanız

const RecipeManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('0');
    const [sortBy, setSortBy] = useState('newest');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    const { user, fetchUserRecipes, fetchUserDeleteRecipe } = useContext(UserContext);
    const { recipeCategoryList, fetchRecipeCategories } = useContext(RecipeContext);


    // Kullanıcının tarifleri
    const [userRecipes, setUserRecipes] = useState([]);
    const [recipePagination, setRecipePagination] = useState([]);

    useEffect(() => {
        if (!user) return; // Kullanıcı yoksa veri çekme
        setLoading(true);
        const fetchOtherData = async () => {
            await fetchRecipeCategories();
            const recipeData = await fetchUserRecipes(user.id);
            if (recipeData.status === "success") {
                setUserRecipes(recipeData.users);
                setRecipePagination(recipeData.pagination);
            }
            setLoading(false);
        };
        fetchOtherData();
    }, [user, showDeleteModal]);


    // Filtreleme ve sıralama
    const filteredRecipes = userRecipes
        .filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === '0' || recipe.category_id == filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return (b.id) - (a.id);
                case 'oldest':
                    return (a.id) - (b.id);
                case 'popular':
                    return b.like_count - a.like_count;
                case 'views':
                    return b.view_count - a.view_count;
                default:
                    return 0;
            }
        });

    const handleDeleteRecipe = (recipe) => {
        setRecipeToDelete(recipe);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        fetchUserDeleteRecipe(recipeToDelete.id);
        setShowDeleteModal(false);
        setRecipeToDelete(null);
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

    const handleShare = async (recipe_id) => {
        const url = `${window.location.origin}/recipes/${recipe_id}`;
        try {
            await navigator.clipboard.writeText(url);
            showToast("Tarif linki kopyalandı")
            setTimeout(() => [], 1000);
        } catch (err) {
            showToast('Kopyalama başarısız');
        }
    };



    const [loading, setLoading] = useState(true);

    const loadMore = async () => {
        if (!loading && userRecipes.length < recipePagination.totalItems) {
            setLoading(true);
            const recipeData = await fetchUserRecipes(user.id, recipePagination.currentPage + 1);
            if (recipeData.status === "success") {
                setUserRecipes(prev => [...prev, ...recipeData.users]);
                setRecipePagination(recipeData.pagination);
            }
            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            {/* Header */}
            <Hero title="Tariflerim" description="Kendi tariflerinizi yönetin ve paylaşın" showSearchBar={false} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

<ToastContainer/>

                {/* Filtreler */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                    <div className="flex flex-col lg:flex-row gap-4 col-span-1 lg:col-span-2">
                        {/* Arama */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tarif ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        {/* Kategori Filtresi */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            {recipeCategoryList.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>

                        {/* Sıralama */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="newest">En Yeni</option>
                            <option value="oldest">En Eski</option>
                            <option value="popular">En Popüler</option>
                            <option value="views">En Çok Görüntülenen</option>
                        </select>

                    </div>
                    <div className='flex justify-end'>
                        <a href='/recipes/addnewrecipe' className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center shadow-lg hover:shadow-xl">
                            <Plus className="w-5 h-5 mr-2" />
                            Yeni Tarif Ekle
                        </a>
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex justify-end items-center mb-6">
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">{recipePagination?.totalItems}</span> tarif bulundu
                    </p>

                </div>

                {/* Tarif Listesi */}
                {filteredRecipes.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {filteredRecipes.map((recipe) => (
                            <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    {/* Görsel */}
                                    <div className="md:w-64 h-48 md:h-auto relative">
                                        <img
                                            src={MainApiURL + recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* İçerik */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <a href={`/recipes/${recipe.id}`} className="block text-gray-900 hover:text-red-600 transition-colors">
                                                    <h3 className="text-xl font-bold  mb-2 line-clamp-2">{recipe.title}</h3>
                                                    <p className="text-gray-600 mb-3 line-clamp-1">{recipe.description}</p>
                                                </a>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {recipe.reading_time} dakika
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        {recipe.servings} kişi
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center">
                                                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                                        {recipe.average_rating <= 0 ? 0 : recipe.average_rating}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Heart className="w-4 h-4 mr-1 text-red-500" />
                                                        {recipe.like_count}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        {recipe.view_count}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm gap-2">
                                                    <span className=" text-gray-500 bg-gray-100 px-4 py-1 rounded-full">
                                                        {recipe.category_name}
                                                    </span>
                                                    <span className={` px-4 py-1 rounded-full bg-red-600 text-white`}>
                                                        {recipe.difficulty}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Aksiyon Butonları */}
                                            <div className="flex flex-col items-center space-x-2 ml-4">
                                                <button
                                                    onClick={() => window.location.href = `/recipes/editrecipe?id=${recipe.id}`}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteRecipe(recipe)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>

                                                <button
                                                    onClick={() => handleShare(recipe.id)}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                    title="Paylaş"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                </button>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Tarif bulunamadı</h3>
                        <p className="text-gray-600 mb-6">Arama kriterlerinizi değiştirmeyi deneyin</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterCategory('0');
                            }}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
                {/* Load More */}
                {userRecipes.length > 0 && (userRecipes.length < recipePagination.totalItems) ? (
                    <div className="text-center mt-12">
                        <button onClick={loadMore} className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                            Daha Fazla Yükle
                        </button>
                    </div>
                ) :
                    <div className="p-10 flex justify-center items-center text-gray-600">
                        <ChefHat className='text-red-500 w-8 h-8' /><p className='text-xl'>&nbsp;&nbsp;Tüm tarifler gösterildi&nbsp;&nbsp;</p><ChefHat className='text-red-500 w-8 h-8' />
                    </div>
                }
            </div>


            {/* Silme Onay Modalı */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Tarifi Sil</h3>
                                <p className="text-gray-600">Bu işlem geri alınamaz</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-6">
                            "<strong>{recipeToDelete?.title}</strong>" tarifini silmek istediğinizden emin misiniz?
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeManagement;