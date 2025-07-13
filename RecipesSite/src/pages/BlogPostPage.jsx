import React, { use, useEffect, useState, useCallback, useContext } from 'react';
import {
    Clock,
    Heart,
    ArrowLeft,
    Share2,
    Calendar,
    Eye,
    MessageCircle,
    Printer, Bookmark, Trash

} from 'lucide-react';
import Navbar from '../components/general/Navbar';
import Hero from '../components/general/Hero';
import LoadingOverlay from '../components/general/LoadingOverlay';
import { MainApiURL } from '../api/api';
import { useBlogContext } from '../contexts/BlogContext';
import { UserContext } from '../contexts/UserContext';
import { toast, ToastContainer } from 'react-toastify';

const BlogPostPage = () => {
    const [isLiked, setIsLiked] = useState(false);
    const [randomlist, setRandomList] = useState([]);
    const [comments, setComments] = useState([]);


    const {
        blog, blogList, loading, fetchBlog, fetchBlogs,
        fetchBlogLikeCount, blogLikeCount,
        fetchBlogBookmarkCount, blogBookmarkCount,
        fetchBlogAddComment, fetchBlogDeleteComment
    } = useBlogContext();


    const {
        user,
        userBlogLikeList, setUserBlogLikeList,
        userBlogBookmarkList, setUserBlogBookmarkList,
        fetchBlogLikes,
        fetchBlogLikeCheck,
        fetchBlogBookmarks,
        fetchBlogBookmarkCheck,
        isLoggedIn,
    } = useContext(UserContext);


    const getID = useCallback(async () => {
        try {
            const { id } = window.location.pathname.split('/').reduce((acc, segment, index, arr) => {
                if (segment === 'blogs' && arr[index + 1]) {
                    acc.id = arr[index + 1];
                }
                return acc;
            }, {});

            if (!id) {
                console.error('Blog ID bulunamadı');
                return;
            }

            fetchBlog(id);

            setComments(blog.comments || []); // Yorumları ayarla, eğer yoksa boş dizi kullan



        } catch (error) {
            console.error('API hatası:', error);
            // hata durumunda 404 sayfasına yönlendirme yapılacak
            window.location.href = '/not-found';
        }
    }, [blog.length]);


    useEffect(() => {
        getID();
        if (!blogList || blogList.length === 0) {
            fetchBlogs(); // Eğer blogList boşsa, tüm blogları yükle

        }
    }, []);


    useEffect(() => {setRandomList(blogList.sort(() => 0.5 - Math.random()).slice(0, 5))},[blogList])

    useEffect(() => {
        setComments(blog.comments || []);
    }, [blog]);

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
            showToast("Blog linki kopyalandı")
            setTimeout(() => [], 1000);
        } catch (err) {
            showToast('Kopyalama başarısız');
        }
    };

    const toggleFavorite = (id) => {

        if (userBlogLikeList.includes(id)) {
            // Eğer tarif zaten beğenilmişse, beğeniyi kaldır
            setUserBlogLikeList(prev => prev.filter(blogId => blogId !== id));
            showToast('Tarif beğenilenlerden çıkarıldı!');
        } else {
            // Eğer tarif beğenilmemişse, beğeniyi ekle
            setUserBlogLikeList(prev => [...prev, id]);
            showToast('Tarif beğenilenlere eklendi!');
        }
        // Burada ayrıca API çağrısı yaparak veritabanını güncelleyebilirsiniz
        fetchBlogLikeCheck(id);
        fetchBlogLikeCount(id);
        fetchBlogBookmarkCount(id);
    };

    const toggleBookmark = (id) => {
        if (userBlogBookmarkList.includes(id)) {
            // Eğer tarif zaten beğenilmişse, beğeniyi kaldır
            setUserBlogBookmarkList(prev => prev.filter(blogId => blogId !== id));
            showToast('Tarif yer imlerinden çıkarıldı!');
        } else {
            // Eğer tarif beğenilmemişse, beğeniyi ekle
            setUserBlogBookmarkList(prev => [...prev, id]);
            showToast('Tarif yer imlerine eklendi!');
        }
        // Burada ayrıca API çağrısı yaparak veritabanını güncelleyebilirsiniz
        fetchBlogBookmarkCheck(id);
    };

    useEffect(() => {
        if (!isLoggedIn) return; // Kullanıcı giriş yapmamışsa hiçbir şey yapma
        fetchBlogLikes();
        fetchBlogBookmarks();
        fetchBlogLikeCount(blog.id);
        fetchBlogBookmarkCount(blog.id);
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) return; // Kullanıcı giriş yapmamışsa hiçbir şey yapma
        fetchBlogLikeCount(blog.id);
        fetchBlogBookmarkCount(blog.id);
    }, [toggleFavorite]);


      const addcomment = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const commentData = {
            user_id: user.id,
            blog_id: blog.id,
            content: formData.get('comment'),
        };
        const aaaaa = await fetchBlogAddComment(blog.id, commentData);
        if (aaaaa.status === 'success') {
            showToast('Yorumunuz başarıyla eklendi!');
            setComments(prevComments => [...prevComments, aaaaa.comment]);
            e.target.reset(); // Formu temizle
        }
    };

    const deleteComment = async (commentId) => {
        const aaaaa = await fetchBlogDeleteComment(blog.id, commentId, user.id);
        if (aaaaa.status === 'success') {
            showToast('Yorumunuz başarıyla silindi!');
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        }
    };

    return (
        <div className="min-h-screen site_container">

            <Navbar />

            {loading && <LoadingOverlay />}
            <ToastContainer />

            <Hero title={blog.title} description={blog.r_description} showSearchBar={false} />
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Image */}
                <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg mb-8">

                    <img
                        src={MainApiURL + blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute flex justify-center bottom-4 left-6 right-6">
                        <div className="flex flex-wrap gap-2 mb-4">

                            {
                                <span key={blog.category_id} className="flex justify-center items-center space-x-2 bg-white backdrop-blur-sm text-gray-800 px-3 mx-1 py-1 rounded-full font-medium">

                                    <img src={MainApiURL + blog.category_icon_path} className='w-10 h-10' alt="" />
                                    <p>{blog.category_name}</p>
                                </span>
                            }
                        </div>
                    </div>
                </div>


                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Article Header */}
                            <header className="mb-8">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                    {blog.title}
                                </h1>

                                <p className="text-xl text-gray-600 mb-6">
                                    {blog.description}
                                </p>

                                {/* Meta Information */}
                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {blog.updated_at}

                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {blog.reading_time} dakika okuma
                                    </div>
                                    <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-2" />
                                        {blog.view_count} görüntülenme
                                    </div>
                                    <div className="flex items-center">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        {blog?.comments?.length} yorum
                                    </div>
                                </div>
                            </header>

                            {/* Article Content */}
                            <div
                                className="prose prose-lg max-w-none prose-red prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:border-red-200 prose-blockquote:bg-red-50 prose-blockquote:text-red-800"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            {/* Article Footer */}
                            <footer className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-600">Bu yazıyı beğendiniz mi?</span>
                                        <button
                                            onClick={() => toggleFavorite(blog.id)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${(userBlogLikeList.includes(blog.id))
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${(userBlogLikeList.includes(blog.id)) ? 'fill-current' : ''}`} />
                                            <span>Beğen ({blogLikeCount})</span>
                                        </button>
                                    </div>
                                </div>
                            </footer>
                        </article>

                        {/* Comments Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Yorumlar ({comments?.length})
                            </h3>

                            {/* Comment Form */}
                            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-4">Yorum:</h4>
                                <form onSubmit={addcomment} className="space-y-4">
                                   
                                    <textarea
                                        rows="4"
                                        placeholder="Yorumunuzu yazın..." name='comment' id='comment'
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
                                    comments && comments.map((comment, index) =>
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
                                                <img
                                                    src={MainApiURL + comment?.user_avatar}
                                                    alt="Commenter"
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
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
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8">
                            <div className="px-4 shadow-lg bg-gradient-to-r from-red-600 to-red-800 rounded-xl mb-8">
                                <div className="flex items-center justify-between h-16">
                                    <button onClick={() => window.history.back()} className="flex items-center text-white cursor-pointer hover:text-gray-300 transition-colors">
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Tariflere Dön
                                    </button>

                                    <div className="flex items-center space-x-3">
                                        <div className='flex justify-center items-center space-x-2 bg-gray-100 rounded-full px-3'>
                                            <button
                                                onClick={() => toggleFavorite(blog.id)}
                                                className={`py-2 rounded-full transition-colors ${(userBlogLikeList.includes(blog.id)) ? 'bg-gray-100 text-red-600' : 'bg-gray-100 text-red-600 hover:bg-red-50 hover:text-red-600'
                                                    }`}
                                            >
                                                <Heart className={`w-5 h-5 ${(userBlogLikeList.includes(blog.id)) ? 'fill-current' : ''}`} />
                                            </button>
                                            <span className="text-sm font-medium text-gray-900">
                                                {blogLikeCount}
                                            </span>
                                        </div>


                                        <div className='flex justify-center items-center space-x-2 bg-gray-100 rounded-full px-3'>
                                            <button
                                                onClick={() => toggleBookmark(blog.id)}
                                                className={`py-2 rounded-full transition-colors ${(userBlogBookmarkList.includes(blog.id)) ? 'bg-gray-100 text-yellow-600' : 'bg-gray-100 text-yellow-600 hover:bg-red-50 hover:text-yellow-600'
                                                    }`}
                                            >
                                                <Bookmark className={`w-5 h-5 ${(userBlogBookmarkList.includes(blog.id)) ? 'fill-current' : ''}`} />
                                            </button>
                                            <span className="text-sm font-medium text-gray-900">
                                                {blogBookmarkCount}
                                            </span>
                                        </div>

                                        <button onClick={handleShare} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                                            <Share2 className="w-5 h-5" />
                                        </button>

                                    </div>
                                </div>
                            </div>
                            {/* Author Bio */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center space-x-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={MainApiURL + blog?.author_avatar}
                                            alt={blog?.author_fullname}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-red-200 shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <a href={`/profile?user=` + blog?.author_username} className="text-lg font-bold text-gray-900">
                                            {blog?.author_fullname}
                                        </a>
                                        <a href={`/profile?user=` + blog?.author_username} className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                                            @{blog?.author_username}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {/* Related Posts */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Diğer Yazılar</h3>
                                <div className="space-y-4">
                                    {randomlist != null && randomlist.map((post) => (
                                        <div key={post.id} className="group cursor-pointer">
                                            <a href={`/blog/${post.id}`} className="flex space-x-3">
                                                <img
                                                    src={MainApiURL + post.image}
                                                    alt={post.title}
                                                    className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors mb-1 text-sm leading-tight">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {post.reading_time} dakika okuma
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
        </div>
    );
};

export default BlogPostPage;