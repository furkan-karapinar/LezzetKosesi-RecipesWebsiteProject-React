// src/contexts/UserContext.js
import { createContext, useState, useCallback, useContext } from 'react';
import { BlogLikesApi, BlogBookmarksApi, BlogLikeCheckApi, BlogBookmarkCheckApi,
  RecipeLikesApi, RecipeBookmarksApi, RecipeLikeCheckApi, RecipeBookmarkCheckApi,
  GetUserApiWithUsername,
  DeleteUserRecipeApi,
  DeleteUserBlogApi
  } from '../api/api'; // API fonksiyonlarını içe aktar

  
  import {
    GetUserApi,
    GetUserBlogsInfoApi,
    GetUserRecipesInfoApi,
    BookmarkBlogApi,
    BookmarkRecipeApi
  } from '../api/api'; // zaten ekli değilse

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Global değişken. Kullanıcı bilgilerini saklamak için

  // Blog
  const [userBlogLikeList, setUserBlogLikeList] = useState([]);
  const [userBlogBookmarkList, setUserBlogBookmarkList] = useState([]);

  // Tarif (Recipe)
  const [userRecipeLikeList, setUserRecipeLikeList] = useState([]);
  const [userRecipeBookmarkList, setUserRecipeBookmarkList] = useState([]);


  // === BLOG İŞLEMLERİ === //
  // Blog Beğeni Listesini Getir
  const fetchBlogLikes = useCallback(async () => {
    if (!user) return;
    try {
      const data = await BlogLikesApi(user.id);
      if (data.status === 'success') {
        setUserBlogLikeList(data.likes.map((like) => like.id));
      }
    } catch (error) {
      console.error('Beğenilen bloglar alınırken hata oluştu:', error);
    }
  }, [user]);


  // Blog Yer İmleri Listesini Getir
  const fetchBlogBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      const data = await BlogBookmarksApi(user.id);
      if (data.status === 'success') {
        setUserBlogBookmarkList(data.bookmarks.map(b => b.id));
      }
    } catch (err) {
      console.error('Blog yer imleri alınamadı:', err);
    }
  }, [user]);

  // Tekil Blog Beğeni Durumunu Güncelle
  const fetchBlogLikeCheck = useCallback(async (id) => {
    if (!user) return null;
    try {
      const data = await BlogLikeCheckApi(user.id, id);
      if (data.status === 'success') {
        if (data.like_status === 'added') {
          setUserBlogLikeList((prev) => [...prev, id]);
        } else if (data.like_status === 'deleted') {
          setUserBlogLikeList((prev) => prev.filter((blogId) => blogId !== id));
        }
      } else {
        console.error('Hata oluştu:', data.message);
      }
    } catch (error) {
      console.error('Beğeni güncellenirken hata oluştu:', error);
    }
  }, [user]);

  // Tekil Blog Yer İmi Durumunu Güncelle
  const fetchBlogBookmarkCheck = useCallback(async (id) => {
    if (!user) return;
    try {
      const data = await BlogBookmarkCheckApi(user.id, id);
      if (data.status === 'success') {
        if (data.bookmark_status === 'added') {
          setUserBlogBookmarkList((prev) => [...prev, id]);
        } else if (data.bookmark_status === 'deleted') {
          setUserBlogBookmarkList((prev) => prev.filter((blogId) => blogId !== id));
        }
      } else {
        console.error('Hata oluştu:', data.message);
      }
    } catch (error) {
      console.error('Yer imi güncellenirken hata oluştu:', error);
    }
  }, [user]);


  // === TARİF İŞLEMLERİ === //

  const fetchRecipeLikes = useCallback(async () => {
    if (!user) return;
    try {
      const data = await RecipeLikesApi(user.id);
      if (data.status === 'success') {
        setUserRecipeLikeList(data.likes.map(like => like.id));
      }
    } catch (err) {
      console.error('Tarif beğenileri alınamadı:', err);
    }
  }, [user]);

  const fetchRecipeBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      const data = await RecipeBookmarksApi(user.id);
      if (data.status === 'success') {
        setUserRecipeBookmarkList(data.bookmarks.map(b => b.id));
      }
    } catch (err) {
      console.error('Tarif yer imleri alınamadı:', err);
    }
  }, [user]);

  const fetchRecipeLikeCheck = useCallback(async (id) => {
    if (!user) return;
    try {
      const data = await RecipeLikeCheckApi(user.id, id);
      if (data.status === 'success') {
        setUserRecipeLikeList(prev =>
          data.like_status === 'added'
            ? [...prev, id]
            : prev.filter(recipeId => recipeId !== id)
        );
      }
    } catch (err) {
      console.error('Tarif beğeni kontrolü hatası:', err);
    }
  }, [user]);

  const fetchRecipeBookmarkCheck = useCallback(async (id) => {
    if (!user) return;
    try {
      const data = await RecipeBookmarkCheckApi(user.id, id);
      if (data.status === 'success') {
        setUserRecipeBookmarkList(prev =>
          data.bookmark_status === 'added'
            ? [...prev, id]
            : prev.filter(recipeId => recipeId !== id)
        );
      }
    } catch (err) {
      console.error('Tarif yer imi kontrolü hatası:', err);
    }
  }, [user]);



  // Deneme

  
  // Profil sayfası işlemleri
  const fetchUserProfile = useCallback(async (userId) => {
    const data = await GetUserApi(userId);
    return data;
  }, []);

  const fetchUserProfileWithUsername = useCallback(async (username) => {
    const data = await GetUserApiWithUsername(username);
    return data;
  }, []);
  
  const fetchUserRecipes = useCallback(async (userId, page = 1) => {
    const data = await GetUserRecipesInfoApi(userId, page);
    return data;
  }, []);

  const fetchUserDeleteRecipe = useCallback(async (recipeId) => {
    try {
      const data = await DeleteUserRecipeApi(user.id, recipeId);
      if (data.status === 'success') {
        return true;
      }
      else {
        return false;
      }
    } catch (error) {
      console.error('Tarif silinirken hata oluştu:', error);
      return false;
    }
  }, [user]);

  const fetchUserBlogs = useCallback(async (userId, page = 1) => {
    const data = await GetUserBlogsInfoApi(userId, page);
    return data;
  }, []);

  const fetchUserDeleteBlog = useCallback(async (blogId) => {
    try {
      const data = await DeleteUserBlogApi(user.id, blogId);
      if (data.status === 'success') {return true} else { return false}
      
    } catch (error) {
      console.error('Blog silinirken hata oluştu:', error);
      return false;
    }
  }, [user]);

  const fetchUserBookmarkRecipes = useCallback(async (userId, page = 1, search,difficulty,category,time,sort) => {
    const data = await BookmarkRecipeApi(userId, page, search,difficulty,category,time,sort);
    return data;
  }, []);
  
  const fetchUserBookmarkBlogs = useCallback(async (userId, page = 1, search,category,time,sort) => {
    const data = await BookmarkBlogApi(userId, page, search,category,time,sort);
    return data;
  }, []);


  return (
    <UserContext.Provider value={{ 
      user, 
      setUser,
      isLoggedIn: !!user, // Kullanıcının oturum açıp açmadığını kontrol et

      // Blog işlemleri
      userBlogLikeList, setUserBlogLikeList,
      userBlogBookmarkList, setUserBlogBookmarkList,
      fetchBlogLikes,
      fetchBlogBookmarks,
      fetchBlogLikeCheck,
      fetchBlogBookmarkCheck,
      
      // Tarif işlemleri
      userRecipeLikeList, setUserRecipeLikeList,
      userRecipeBookmarkList, setUserRecipeBookmarkList,
      fetchRecipeLikes,
      fetchRecipeBookmarks,
      fetchRecipeLikeCheck,
      fetchRecipeBookmarkCheck,
      fetchUserDeleteRecipe,
      fetchUserDeleteBlog,

      // Profil işlemleri
      fetchUserProfile,
      fetchUserProfileWithUsername,
      fetchUserRecipes,
      fetchUserBlogs,
      fetchUserBookmarkRecipes,
      fetchUserBookmarkBlogs,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);