// src/contexts/BlogContext.js
import { createContext, useState, useCallback, useContext } from 'react';
// RECİPES APİ ÇEKİLECEK
import { BlogCategoryApi, GetBlogInfo, getBlogBookmarkCount , getBlogLikeCount, addCommentToBlog, deleteCommentFromBlog } from '../api/api'; // Tarif kategorilerini getiren API fonksiyonu


export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {

  const [blog, setBlog] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [blogCategoryList, setBlogCategoryList] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [blogLikeCount, setBlogLikeCount] = useState(0);
  const [blogBookmarkCount, setBlogBookmarkCount] = useState(0);

  // Kategorileri getir
  const fetchBlogCategories = useCallback(async () => {
    try {
      const data = await BlogCategoryApi();
      if (!data.error) {
        const categories = data.map((cat) => ({
          id: cat.id,
          category_name: cat.category_name,
          category_icon: cat.category_icon_path,
          blogs_count: cat.category_count,
        }));
        setBlogCategoryList(categories);
      }
    } catch (err) {
      console.error("Kategori verileri alınamadı", err);
    }
  }, []);

  // URLSearchParams gibi parametrelerle tarifleri getir
  const fetchBlogs = useCallback(async (params, isNewSearch = false, pageNum = 1) => {
    setLoading(true);

    try {
      const paramStr = new URLSearchParams({
        page: pageNum,
        ...params
      }).toString();

      const res = await fetch(`http://localhost:3000/api/v1/blogs?${paramStr}`);
      const data = await res.json();

      if (data.status === 'success') {
        const newBlogs = data.blogs;

        if (isNewSearch || pageNum === 1) {
          setBlogList(newBlogs);
        } else {
          setBlogList(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const uniqueNewBlogs = newBlogs.filter(r => !existingIds.has(r.id));
            return [...prev, ...uniqueNewBlogs];
          });
        }

        setPaginationInfo(data.pagination);
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
        setPage(pageNum);
      }
    } catch (err) {
      console.error("Tarifler alınırken hata oluştu", err);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchBlog = useCallback(async (id) => {

    setLoading(true);


    try {

      const data = await GetBlogInfo(id);

      if (data.status === 'success') {
        setBlog(data.blog);
      }
    } catch (error) {
      console.error('API hatası:', error);
      // hata durumunda 404 sayfasına yönlendirme yapılacak
      window.location.href = '/not-found';

    } finally {
      setLoading(false);
    }
  }, []);


  const fetchBlogLikeCount = useCallback(async (blogId) => {
    try {

      const data = await getBlogLikeCount(blogId);
      if (data.status === 'success') {
        setBlogLikeCount(data.like_count);
      } else {
        setBlogLikeCount(0);
      }
    } catch (error) {
      console.error("Beğeni sayısı alınamadı", error);
      return null;
    }
  }, []);

  const fetchBlogBookmarkCount = useCallback(async (blogId) => {
    try {

      const data = await getBlogBookmarkCount(blogId);
      if (data.status === 'success') {
        setBlogBookmarkCount(data.bookmark_count);
      } else {
        setBlogBookmarkCount(0);
      }
    } catch (error) {
      console.error("Beğeni sayısı alınamadı", error);
      return null;
    }
  }, []);

   const fetchBlogAddComment = useCallback(async (blogId, commentData) => {
      return await addCommentToBlog(blogId, commentData);
    }, []);

    const fetchBlogDeleteComment = useCallback(async (blogId, commentId, userID) => {
      return await deleteCommentFromBlog(blogId, commentId, userID);
    }, []);

  return (
    <BlogContext.Provider value={{
      blog,
      blogList,
      blogCategoryList,
      paginationInfo,
      hasMore,
      page,
      loading,
      blogLikeCount,
      blogBookmarkCount,
      fetchBlogs,
      fetchBlogCategories,
      fetchBlog,
      fetchBlogLikeCount,
      fetchBlogBookmarkCount,
      fetchBlogAddComment,
      fetchBlogDeleteComment
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => useContext(BlogContext);
