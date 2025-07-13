import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
    Mail,
    MapPin,
    Calendar,
    Edit3,
    Heart,
    Bookmark,
    Eye,
    Clock,
    ChefHat,
    TrendingUp,
    Plus,
    UserRound
} from 'lucide-react';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; // UserContext'i içe aktar
import { MainApiURL } from '../api/api';
import Navbar from '../components/general/Navbar'; // Navbar bileşenini içe aktar
import LoadingOverlay from '../components/general/LoadingOverlay';
import Hero from '../components/general/Hero';
import Footer from '../components/general/Footer';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('recipes');
    const [tabs, setTabs] = useState([]);
    const [userRecipes, setUserRecipes] = useState([]);
    const [userBlogs, setUserBlogs] = useState([]);
    const {
        user,
        fetchUserProfileWithUsername,
        fetchUserRecipes,
        fetchUserBlogs,
        fetchUserBookmarkRecipes,
        fetchUserBookmarkBlogs
    } = useContext(UserContext);

    const [viewedUser, setViewedUser] = useState({});
    const [userBookmarkRecipes, setUserBookmarkRecipes] = useState([]);
    const [userBookmarkBlogs, setUserBookmarkBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itsme, setItsme] = useState(false);

    const [RecipePagination, setRecipePagination] = useState([]);
    const [BlogPagination, setBlogPagination] = useState([]);
    const [BookmarkRecipePagination, setBookmarkRecipePagination] = useState([]);
    const [BookmarkBlogPagination, setBookmarkBlogPagination] = useState([]);




    useEffect(() => {
        const fetchInitialProfile = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const userIdFromParams = queryParams.get('user');
            const userId = userIdFromParams || user.username;
            const data = await fetchUserProfileWithUsername(userId);
            if (userId == user.username) setItsme(true);
            setViewedUser(data);
        };
        fetchInitialProfile();
    }, [user, fetchUserProfileWithUsername]);



    useEffect(() => {
        if (!viewedUser?.id) return;

        const fetchOtherData = async () => {
            const recipeData = await fetchUserRecipes(viewedUser.id);
            if (recipeData.status === "success") {
                setUserRecipes(recipeData.users);
                setRecipePagination(recipeData.pagination);
            }

            const blogData = await fetchUserBlogs(viewedUser.id);
            if (blogData.status === "success") {
                setUserBlogs(blogData.users);
                setBlogPagination(blogData.pagination);
            }

            const bookmarkRecipeData = await fetchUserBookmarkRecipes(viewedUser.id);
            if (bookmarkRecipeData.status === "success") {
                setUserBookmarkRecipes(bookmarkRecipeData.recipes);
                setBookmarkRecipePagination(bookmarkRecipeData.pagination);
            }

            const bookmarkBlogData = await fetchUserBookmarkBlogs(viewedUser.id);
            if (bookmarkBlogData.status === "success") {
                setUserBookmarkBlogs(bookmarkBlogData.recipes);
                setBookmarkBlogPagination(bookmarkBlogData.pagination);
            }
        };

        fetchOtherData();
    }, [viewedUser]);



    const LoadMore = useCallback(async () => {
        setLoading(true);

        try {
            const tabConfig = {
                recipes: {
                    page: RecipePagination.currentPage,
                    fetch: fetchUserRecipes,
                    setData: setUserRecipes,
                    setPage: setRecipePagination,
                    dataKey: 'users'
                },
                blogs: {
                    page: BlogPagination.currentPage,
                    fetch: fetchUserBlogs,
                    setData: setUserBlogs,
                    setPage: setBlogPagination,
                    dataKey: 'users'
                },
                saved_recipes: {
                    page: BookmarkRecipePagination.currentPage,
                    fetch: fetchUserBookmarkRecipes,
                    setData: setUserBookmarkRecipes,
                    setPage: setBookmarkRecipePagination,
                    dataKey: 'recipes'
                },
                saved_blogs: {
                    page: BookmarkBlogPagination.currentPage,
                    fetch: fetchUserBookmarkBlogs,
                    setData: setUserBookmarkBlogs,
                    setPage: setBookmarkBlogPagination,
                    dataKey: 'recipes'
                }
            };

            const selected = tabConfig[activeTab];
            if (!selected) return;

            const nextPage = selected.page + 1;
            const data = await selected.fetch(viewedUser.id, nextPage);

            if (data?.status === "success") {
                selected.setData(prev => [...prev, ...data[selected.dataKey]]);
                selected.setPage(data.pagination);
            } else {
                console.error("LoadMore error:", data?.message);
            }
        } catch (err) {
            console.error("LoadMore exception:", err);
        } finally {
            setLoading(false);
        }
    }, [
        activeTab, viewedUser,
        RecipePagination, BlogPagination, BookmarkRecipePagination, BookmarkBlogPagination,
        fetchUserRecipes, fetchUserBlogs, fetchUserBookmarkRecipes, fetchUserBookmarkBlogs
    ]);

    const firsttabs = useMemo(() => [
        { id: 'recipes', label: 'Tarifler', icon: ChefHat, count: RecipePagination.totalItems, hasMore: RecipePagination.currentPage < RecipePagination.totalPages },
        { id: 'blogs', label: 'Bloglar', icon: ChefHat, count: BlogPagination.totalItems, hasMore: BlogPagination.currentPage < BlogPagination.totalPages },
        { id: 'saved_recipes', label: 'Kaydedilen Tarifler', icon: Bookmark, count: BookmarkRecipePagination.totalItems, hasMore: BookmarkRecipePagination.currentPage < BookmarkRecipePagination.totalPages },
        { id: 'saved_blogs', label: 'Kaydedilen Bloglar', icon: Bookmark, count: BookmarkBlogPagination.totalItems, hasMore: BookmarkBlogPagination.currentPage < BookmarkBlogPagination.totalPages },
        { id: 'activity', label: 'Aktivite', icon: TrendingUp, count: null, currentPage: null, totalPages: null }
    ], [userRecipes.length, userBlogs.length, userBookmarkRecipes.length, userBookmarkBlogs.length]);


    useEffect(() => {
        const visibleTabs = firsttabs.filter(tab => tab.count !== null && tab.count !== 0);
        setTabs(visibleTabs);
        setLoading(false);
    }, [firsttabs]);


    const addnewonclick = () => {
        if (activeTab === 'recipes') {
            window.location.href = '/recipes/addnewrecipe';
        } else {
            window.location.href = "/blogs/addnewblog"
        }
    };

    return (
        <div className="min-h-screen site_container">

            <Navbar />

            {loading ? <LoadingOverlay /> : ""}

            <Hero showSearchBar={false} />

            {/* Profile Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">


                {/* Header */}
                {itsme && <div className="bg-white shadow-2xl rounded-xl mb-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <h1 className="text-2xl font-bold text-gray-900">Profilim</h1>
                            <div className="flex items-center space-x-3">
                                <a href='/myprofile'
                                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>{'Düzenle'}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>}

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Profile Sidebar */}
                    <div className={`lg:col-span-1`}>
                        <div className='sticky top-24 space-y-4 pb-1'>
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                {/* Avatar */}
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    { (String(viewedUser?.avatar).includes("null")) ? (
                                        <div className="rounded-full bg-red-200 p-2 flex items-center justify-center">
                                            <UserRound className="w-full h-full p-5 transition-colors" />
                                        </div>
                                    ) : (
                                        <img
                                            src={MainApiURL + viewedUser?.avatar}
                                            alt={viewedUser?.fullname}
                                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    )}

                                </div>

                                {/* Badges */}
                                <div>
                                    {viewedUser?.badges?.map((badge, index) => (
                                        <div key={index} className={`flex items-center justify-center space-x-2 px-3 py-2 m-4 rounded-2xl bg-red-700 text-white`}>
                                            <span className="text-lg"><img className='w-6 h-6' src={MainApiURL + badge.badge_icon} alt="" /></span>
                                            <span className="text-sm font-medium">{badge.badge_name}</span>
                                        </div>
                                    ))}
                                </div>


                                {/* Profile Info */}
                                <div className="text-center mb-6">

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewedUser?.fullname}</h2>
                                    <p className="text-gray-600">{viewedUser?.about}</p>

                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">{parseInt(viewedUser?.recipe_count, 10)}</div>
                                        <div className="text-sm text-gray-500">Tarif</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">{parseInt(viewedUser?.blog_count, 10)}</div>
                                        <div className="text-sm text-gray-500">Blog</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">{parseInt(viewedUser?.like_count, 10)}</div>
                                        <div className="text-sm text-gray-500">Beğeni</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">

                                            {parseInt(viewedUser?.view_count, 10)}
                                        </div>
                                        <div className="text-sm text-gray-500">Görüntülenme</div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-4 h-4 mr-3" />
                                        <span className="text-sm">{viewedUser?.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-3" />
                                        <span className="text-sm">{viewedUser?.city + ", " + viewedUser?.country}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-3" />
                                        <span className="text-sm">{viewedUser?.created_at} tarihinde katıldı</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Main Content */}
                    <div className={`lg:col-span-3`}>
                        {/* Tabs */}
                        <div className="bg-white rounded-2xl shadow-lg mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                    ? 'border-red-600 text-red-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{tab.label}</span>
                                                {tab.count && (
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {(activeTab === 'recipes' || activeTab === 'blogs') && (
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-gray-900"> {activeTab === 'recipes' ? 'Tarifler' : 'Bloglar'}</h3>
                                            {itsme && <button onClick={addnewonclick} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                                                <Plus className="w-4 h-4 mr-2" />
                                                {activeTab === 'recipes' ? 'Yeni Tarif' : 'Yeni Blog Yazısı'} Ekle
                                            </button>}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {(activeTab === 'recipes' ? userRecipes : userBlogs)?.map((x) => (
                                                <div key={x.id} className="group cursor-pointer">
                                                    <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                                                        <div className="relative">
                                                            <img
                                                                src={MainApiURL + x.image}
                                                                alt={x.title}
                                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />

                                                            {activeTab === 'recipes' && <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                                                                {x.difficulty}
                                                            </div>}
                                                        </div>

                                                        <div className="p-4">
                                                            <a href={"/recipes/" + x.id} className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                                                {x.title}
                                                            </a>

                                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="flex items-center">
                                                                        <Clock className="w-4 h-4 mr-1" />
                                                                        {x.reading_time} dakika
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center space-x-3">
                                                                    <div className="flex items-center">
                                                                        <Heart className="w-4 h-4 mr-1" />
                                                                        {x.like_count}
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Eye className="w-4 h-4 mr-1" />
                                                                        {x.view_count}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(activeTab === 'saved_recipes' || activeTab === 'saved_blogs') && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Kaydedilen {activeTab === 'saved_recipes' ? "Tarifler" : "Bloglar"}</h3>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {(activeTab === 'saved_recipes' ? userBookmarkRecipes : userBookmarkBlogs).map((x) => (
                                                <div key={x.id} className="group cursor-pointer">
                                                    <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                                                        <div className="relative">
                                                            <img

                                                                src={MainApiURL + x.image}
                                                                alt={x.title}
                                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />

                                                        </div>

                                                        <div className="p-4">
                                                            <h4 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                                                                {x.title}
                                                            </h4>
                                                            <div className='flex items-center justify-between text-center'>
                                                                <div className='flex items-center'>
                                                                    <p className="text-sm text-gray-500">{x.author_fullname}</p>
                                                                </div>

                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <Clock className="w-4 h-4 mr-1" />
                                                                    {x.reading_time} dakika
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'activity' && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h3>

                                        <div className="space-y-4">
                                            {[1, 2, 3].map((item) => (
                                                <div key={item} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                        <Heart className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-900">
                                                            <strong>Klasik İtalyan Carbonara</strong> tarifini beğendiniz
                                                        </p>
                                                        <p className="text-sm text-gray-500">2 saat önce</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {
                                    tabs.find(tab => tab.id === activeTab)?.hasMore &&
                                    <div className="mt-6 flex justify-center">
                                        <button
                                            className="bg-red-600 text-white text-lg px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                            onClick={LoadMore}
                                        >
                                            Daha Fazla Yükle
                                        </button>
                                    </div>
                                }


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
};

export default ProfilePage;