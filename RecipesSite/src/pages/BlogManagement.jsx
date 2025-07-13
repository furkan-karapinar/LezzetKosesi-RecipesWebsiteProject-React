import React, { useState, useContext, useEffect } from 'react';
import {
    Plus, Search, Edit3, Trash2, Share2, Eye, MessageSquareText, AlertTriangle, BookOpen
} from 'lucide-react';
import Hero from '../components/general/Hero';
import Navbar from '../components/general/Navbar';
import { UserContext } from '../contexts/UserContext';
import { BlogContext } from '../contexts/BlogContext';
import { MainApiURL } from '../api/api';
import { toast, ToastContainer } from 'react-toastify'; // Eğer toast bildirimleri kullanacaksanız

const BlogManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('0');
    const [sortBy, setSortBy] = useState('newest');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [userBlogs, setUserBlogs] = useState([]);
    const [blogPagination, setBlogPagination] = useState({});
    const [loading, setLoading] = useState(true);

    const { user, fetchUserBlogs, fetchUserDeleteBlog } = useContext(UserContext);
    const { blogCategoryList, fetchBlogCategories } = useContext(BlogContext);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            await fetchBlogCategories();
            const result = await fetchUserBlogs(user.id);
            if (result.status === "success") {
                setUserBlogs(result.users);
                setBlogPagination(result.pagination);
            }
            setLoading(false);
        };

        fetchData();
    }, [user, showDeleteModal]);

    const filteredBlogs = userBlogs
        .filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === '0' || blog.category_id == filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest': return (b.id) - (a.id);
                case 'oldest': return (a.id) - (b.id);
                case 'views': return b.view_count - a.view_count;
                case 'comments': return b.comment_count - a.comment_count;
                default: return 0;
            }
        });

    const handleDelete = (blog) => {
        setBlogToDelete(blog);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await fetchUserDeleteBlog(blogToDelete.id);
        setShowDeleteModal(false);
        setBlogToDelete(null);
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

    const handleShare = async (id) => {
        const url = `${window.location.origin}/blogs/${id}`;
        try {
            await navigator.clipboard.writeText(url);
            showToast('Blog linki kopyalandı')
             setTimeout(() => [], 1000);
        } catch (error) {
            showToast('Kopyalama başarısız');
        }
    };

    const loadMore = async () => {
        if (!loading && userBlogs.length < blogPagination.totalItems) {
            setLoading(true);
            const result = await fetchUserBlogs(user.id, blogPagination.currentPage + 1);
            if (result.status === "success") {
                setUserBlogs(prev => [...prev, ...result.blogs]);
                setBlogPagination(result.pagination);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Hero title="Bloglarım" description="Yayınladığınız blog yazılarını yönetin ve paylaşın" showSearchBar={false} />

            <ToastContainer />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filtre ve Ekleme Alanı */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                    <div className="flex flex-col lg:flex-row gap-4 col-span-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Blog ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                            <option value="0">Tüm Kategoriler</option>
                            {blogCategoryList.map(cat => (cat.id != 0) && (
                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                            <option value="newest">En Yeni</option>
                            <option value="oldest">En Eski</option>
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <a href="/blogs/addnewblog" className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 flex items-center shadow-lg">
                            <Plus className="w-5 h-5 mr-2" />
                            Yeni Blog Ekle
                        </a>
                    </div>
                </div>

                {/* Blog Sayısı */}
                <div className="flex justify-end text-gray-600 mb-6">
                    <p><span className="font-semibold text-gray-900">{blogPagination?.totalItems || 0}</span> blog bulundu</p>
                </div>

                {/* Blog Listesi */}
                {filteredBlogs.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {filteredBlogs.map(blog => (
                            <div key={blog.id} className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-64 h-48 md:h-auto">
                                        <img
                                            src={MainApiURL + blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <a href={`/blogs/${blog.id}`} className="block text-gray-900 hover:text-red-600 transition-colors">
                                                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
                                                    <p className="text-gray-600 line-clamp-2">{blog.description}</p>
                                                </a>
                                                <div className="flex text-sm text-gray-500 gap-4 mt-4">
                                                    <span className="flex items-center">
                                                        <Eye className="w-4 h-4 mr-1" /> {blog.view_count}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <MessageSquareText className="w-4 h-4 mr-1" /> {blog.comment_count}
                                                    </span>
                                                </div>
                                                <div className='mt-4 flex flex-wrap gap-2'>
                                                    {
                                                        blog.category_id && <div key={blog.category_id} className="mt-2 text-sm text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-full">
                                                            {blog.category_name}
                                                        </div>
                                                    }
                                                </div>


                                            </div>
                                            <div className="ml-4 flex flex-col items-center space-y-2">
                                                <button onClick={() => window.location.href = `/blogs/editblog?id=${blog.id}`} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(blog)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleShare(blog.id)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
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
                        <div className="text-gray-400 text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Blog bulunamadı</h3>
                        <p className="text-gray-600 mb-6">Farklı bir arama deneyin veya filtreleri temizleyin.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterCategory('0');
                            }}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}

                {/* Load More */}
                {userBlogs.length > 0 && userBlogs.length < blogPagination.totalItems ? (
                    <div className="text-center mt-12">
                        <button
                            onClick={loadMore}
                            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-medium"
                        >
                            Daha Fazla Yükle
                        </button>
                    </div>
                ) : (
                    userBlogs.length > 0 && (
                        <div className="p-10 flex justify-center items-center text-gray-600">
                            <BookOpen className="text-red-500 w-8 h-8" />
                            <p className="text-xl">&nbsp;&nbsp;Tüm bloglar gösterildi&nbsp;&nbsp;</p>
                            <BookOpen className="text-red-500 w-8 h-8" />
                        </div>
                    )
                )}
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
                                <h3 className="text-lg font-bold text-gray-900">Blogu Sil</h3>
                                <p className="text-gray-600">Bu işlem geri alınamaz.</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            "<strong>{blogToDelete?.title}</strong>" blog yazısını silmek istediğinizden emin misiniz?
                        </p>
                        <div className="flex space-x-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                İptal
                            </button>
                            <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagement;
