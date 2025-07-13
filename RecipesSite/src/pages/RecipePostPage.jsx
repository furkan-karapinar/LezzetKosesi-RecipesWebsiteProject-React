import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Clock, Users, Star, ArrowLeft, Heart, Bookmark, ChefHat, Share2, Trash } from 'lucide-react';
import Navbar from '../components/general/Navbar';
import Hero from '../components/general/Hero';
import Footer from '../components/general/Footer';
import { ApiWithPage, MainApiURL, RecipeLikeCheckApi, RecipeLikesApi } from '../api/api'; // Assuming you have an API file to fetch recipes
import LoadingOverlay from '../components/general/LoadingOverlay';
import { UserContext } from '../contexts/UserContext'; // Assuming you have a UserContext to manage user state
import { ToastContainer, toast } from 'react-toastify';
import { useRecipeContext } from '../contexts/RecipeContext';


const RecipePostPage = () => {

    const [recipe, setRecipe] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [randomList, setRandomList] = useState([]);


    const [loading, setLoading] = useState(false);

    const fetchRecipes = useCallback(async () => {

        setLoading(true);


        try {
            const { id } = window.location.pathname.split('/').reduce((acc, segment, index, arr) => {
                if (segment === 'recipes' && arr[index + 1]) {
                    acc.id = arr[index + 1];
                }
                return acc;
            }, {});
            const response = await fetch(`http://localhost:3000/api/v1/recipes/${id}`);
            const data = await response.json();

            if (data.status === 'success') {
                setRecipe(data.recipe);
            }
        } catch (error) {
            console.error('API hatası:', error);
            // hata durumunda 404 sayfasına yönlendirme yapılacak
            window.location.href = '/not-found';

        } finally {
            setLoading(false);
        }
    }, [recipe.length]);

    const fetchData = useCallback(async () => {
        const data = await ApiWithPage(1);
        if (data.error) {
            setError(data.error);
        } else {
            setRecipes(data.recipes);
        }
        setLoading(false);
    }, [recipes.length]);



    useEffect(() => {
        fetchRecipes();
        fetchData();
    }, []);


    const {
        fetchRecipeLikeCount, recipeLikeCount,
        fetchRecipeBookmarkCount, recipeBookmarkCount, fetchRecipeAddComment, fetchRecipeDeleteComment
    } = useRecipeContext();


    const {
        user,
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


    useEffect(() => { setRandomList(recipes.sort(() => 0.5 - Math.random()).slice(0, 5)) }, [recipes])



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
        fetchRecipeLikeCount(id);
        fetchRecipeBookmarkCount(id);
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
        fetchRecipeLikeCount(recipe.id);
        fetchRecipeBookmarkCount(recipe.id);
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) return; // Kullanıcı giriş yapmamışsa hiçbir şey yapma
        fetchRecipeLikeCount(recipe.id);
        fetchRecipeBookmarkCount(recipe.id);
    }, [toggleFavorite]);


    const addcomment = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const commentData = {
            user_id: user.id,
            recipe_id: recipe.id,
            content: formData.get('comment'),
        };
        const aaaaa = await fetchRecipeAddComment(recipe.id, commentData);
        if (aaaaa.status === 'success') {
            showToast('Yorumunuz başarıyla eklendi!');
            setRecipe(prevRecipe => ({ ...prevRecipe, comments: [...prevRecipe.comments, aaaaa.comment] }));
            e.target.reset(); // Formu temizle
        }
    };

    const deleteComment = async (commentId) => {
        const aaaaa = await fetchRecipeDeleteComment(recipe.id, commentId, user.id);
        if (aaaaa.status === 'success') {
            showToast('Yorumunuz başarıyla silindi!');
            setRecipe(prevRecipe => ({
                ...prevRecipe,
                comments: prevRecipe.comments.filter(comment => comment.id !== commentId)
            }));
        }
    };

    return (
        <div className="min-h-screen site_container">
            {/* Header */}
            <Navbar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

            <Hero showSearchBar={false} title={recipe.title} description={recipe.description} />
            {/* Hero Image */}

            {loading && <LoadingOverlay />}


            {/* Recipe Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg mb-8">
                    <img
                        src={MainApiURL + recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute flex justify-center bottom-4 left-6 right-6">
                        <div className="flex flex-wrap gap-2 mb-4">

                            <span className="flex space-x-3 bg-white backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-lg font-medium">
                                <img src={MainApiURL + recipe.category_icon_path} className='w-7 h-7' alt="" />
                                <p>{recipe.category_name}</p>
                            </span>

                        </div>
                    </div>
                </div>



                <div className="bg-white rounded-2xl shadow-lg p-6 my-6">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        <div className="text-center p-2">
                            <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{recipe.reading_time}</div>
                            <div className="text-sm text-gray-600">Toplam Süre</div>
                        </div>

                        <div className="text-center p-2">
                            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{recipe.servings}</div>
                            <div className="text-sm text-gray-600">Kişi</div>
                        </div>

                        <div className="text-center p-2">
                            <ChefHat className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{recipe.difficulty}</div>
                            <div className="text-sm text-gray-600">Zorluk</div>
                        </div>

                        <div className="text-center p-2">
                            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{recipe.average_rating}</div>
                            <div className="text-sm text-gray-600">{recipe.ratings?.length} değerlendirme</div>
                        </div>

                        <div className="text-center p-2">
                            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{recipe.view_count}</div>
                            <div className="text-sm text-gray-600">Görüntülenme</div>
                        </div>


                        <div className="text-center p-2">
                            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{recipe.like_count}</div>
                            <div className="text-sm text-gray-600">Beğeni</div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">


                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Ingredients */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Malzemeler</h2>
                            </div>

                            <div className="space-y-3">
                                <p>{recipe.ingredients}</p>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hazırlanışı</h2>

                            <div className="space-y-4">
                                <pre className='text-wrap'>{recipe.content}</pre>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Yorumlar ({recipe?.comments?.length})
                            </h3>

                            {/* Comment Form */}
                            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4">Yorum:</h4>
                                <form onSubmit={addcomment} className="space-y-4">
                                    <textarea
                                        rows="4" name='comment' id='comment'
                                        placeholder="Yorumunuzu yazın..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Yorum Gönder
                                    </button>
                                </form>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {/* Comment 1 */}

                                {
                                    recipe?.comments && recipe.comments.map((comment, index) =>
                                    (
                                        <div key={index} className=" relative border-b border-gray-200 pb-6">
                                            {/* Çöp kutusu: sadece kendi yorumuysa sağ üst köşeye sabitlenir */}
                                            {comment?.user_id === user.id && (
                                                <button
                                                    onClick={() => deleteComment(comment.id)}
                                                    className="absolute top-0 right-0 mt-2 mr-2 p-2 hover:bg-red-600 text-red-600 hover:text-white rounded transition-colors"
                                                    title="Yorumu Sil"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            )}
                                            <div className="flex items-start space-x-4">

                                                {(comment?.user_avatar) ? (<img
                                                    src={MainApiURL + comment?.user_avatar || 'https://via.placeholder.com/150'}
                                                    alt="Commenter"
                                                    className="w-13 h-13 rounded-full object-cover"
                                                />) : <div class="w-13 h-13 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chef-hat w-7 h-7 text-white" aria-hidden="true"><path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"></path><path d="M6 17h12"></path></svg></div>}
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h5 className="font-semibold text-gray-900">{comment?.user_fullname}</h5>
                                                        <span className="text-sm text-gray-500">
                                                            {comment?.updated_at}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 mb-3">
                                                        {comment?.content}
                                                    </p>

                                                    {/* {
                                                        (comment?.user_id === user.id) ? (<div className="flex items-center space-x-4">
                                                            <button onClick={() => deleteComment(comment.id)} className="p-2 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-colors">
                                                                <Trash className='w-5 h-5'/>
                                                            </button>
                                                        </div>) : null
                                                    } */}

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }


                            </div>

                            {/* Load More Comments */}
                            {/* <div className="text-center mt-8">
                                <button className="text-red-600 hover:text-red-700 font-medium transition-colors">
                                    Daha Fazla Yorum Yükle
                                </button>
                            </div> */}
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Nutrition Info */}
                        <div className='sticky top-24 space-y-4'>
                            <div className="px-4 shadow-lg bg-gradient-to-r from-red-600 to-red-800 rounded-xl mb-8">
                                <div className="flex items-center justify-between h-16">
                                    <button className="flex items-center text-white cursor-pointer hover:text-gray-300 transition-colors">
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Tariflere Dön
                                    </button>

                                    <div className="flex items-center space-x-3">
                                        <div className='flex justify-center items-center space-x-2 bg-gray-100 rounded-full px-3'>
                                            <button
                                                onClick={() => toggleFavorite(recipe.id)}
                                                className={`py-2 rounded-full transition-colors ${(userRecipeLikeList.includes(recipe.id)) ? 'bg-gray-100 text-red-600' : 'bg-gray-100 text-red-600 hover:bg-red-50 hover:text-red-600'
                                                    }`}
                                            >
                                                <Heart className={`w-5 h-5 ${(userRecipeLikeList.includes(recipe.id)) ? 'fill-current' : ''}`} />
                                            </button>
                                            <span className="text-sm font-medium text-gray-900">
                                                {recipeLikeCount}
                                            </span>
                                        </div>


                                        <div className='flex justify-center items-center space-x-2 bg-gray-100 rounded-full px-3'>
                                            <button
                                                onClick={() => toggleBookmark(recipe.id)}
                                                className={`py-2 rounded-full transition-colors ${(userRecipeBookmarkList.includes(recipe.id)) ? 'bg-gray-100 text-yellow-600' : 'bg-gray-100 text-yellow-600 hover:bg-red-50 hover:text-yellow-600'
                                                    }`}
                                            >
                                                <Bookmark className={`w-5 h-5 ${(userRecipeBookmarkList.includes(recipe.id)) ? 'fill-current' : ''}`} />
                                            </button>
                                            <span className="text-sm font-medium text-gray-900">
                                                {recipeBookmarkCount}
                                            </span>
                                        </div>

                                        <button onClick={handleShare} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                                            <Share2 className="w-5 h-5" />
                                        </button>

                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center space-x-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={MainApiURL + recipe?.author_avatar}
                                            alt={recipe?.author_fullname}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-red-200 shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <a href={`/profile?user=` + recipe.author_username} className="text-lg font-bold text-gray-900">
                                            {recipe?.author_fullname}
                                        </a>
                                        <a href={`/profile?user=` + recipe.author_username} className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                                            @{recipe?.author_username}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Benzer Tarifler</h3>
                                <div className="space-y-4">
                                    {randomList.map((relatedRecipe) => (
                                        <div key={relatedRecipe.id} className="group cursor-pointer">
                                            <a href={`${relatedRecipe.id}`} className="flex space-x-3">
                                                <img
                                                    src={MainApiURL + relatedRecipe.image}
                                                    alt={relatedRecipe.title}
                                                    className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors mb-1 leading-tight">
                                                        {relatedRecipe.title}
                                                    </h4>
                                                    <div className="flex items-center justify-between text-gray-500">
                                                        <div className="flex items-center">
                                                            <Clock className="w-5 h-5 mr-1" />
                                                            {relatedRecipe.reading_time} dakika
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Star className="w-5 h-5 mr-1 text-yellow-500" />
                                                            {relatedRecipe.average_rating}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RecipePostPage;