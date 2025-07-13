// src/contexts/RecipeContext.js
import { createContext, useState, useCallback, useContext } from 'react';
// RECİPES APİ ÇEKİLECEK
import { getRecipeLikeCount, RecipeCategoryApi, getRecipeBookmarkCount, 
  getMostViewedRecipes, getAddLastRecipes, getMostLikedRecipes,
  addCommentToRecipe, deleteCommentFromRecipe
 } from '../api/api'; // Tarif kategorilerini getiren API fonksiyonu


export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {

  const [recipeList, setRecipeList] = useState([]);
  const [recipeCategoryList, setRecipeCategoryList] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  // Kategorileri getir
  const fetchRecipeCategories = useCallback(async () => {
    try {
      const data = await RecipeCategoryApi();
      if (!data.error) {
        const categories = data.map((cat) => ({
          id: cat.id,
          category_name: cat.category_name,
          category_icon: cat.category_icon_path,
          recipes_count: cat.recipe_count,
        }));
        setRecipeCategoryList(categories);
      }
    } catch (err) {
      console.error("Kategori verileri alınamadı", err);
    }
  }, []);

  // URLSearchParams gibi parametrelerle tarifleri getir
  const fetchRecipes = useCallback(async (params, isNewSearch = false, pageNum = 1) => {
    setLoading(true);

    try {
      const paramStr = new URLSearchParams({
        page: pageNum,
        ...params
      }).toString();

      const res = await fetch(`http://localhost:3000/api/v1/recipes?${paramStr}`);
      const data = await res.json();

      if (data.status === 'success') {
        const newRecipes = data.recipes;

        if (isNewSearch || pageNum === 1) {
          setRecipeList(newRecipes);
        } else {
          setRecipeList(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const uniqueNewRecipes = newRecipes.filter(r => !existingIds.has(r.id));
            return [...prev, ...uniqueNewRecipes];
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

  const [recipeDetail, setRecipeDetail] = useState(null);
  const [recipeLikeCount, setRecipeLikeCount] = useState(0);
  const [recipeBookmarkCount, setRecipeBookmarkCount] = useState(0);

  const fetchRecipeDetail = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/recipes/${id}`);
      const data = await res.json();
      if (data.status === 'success') {
        setRecipeDetail(data.recipe);
      } else {
        throw new Error('Tarif bulunamadı');
      }
    } catch (err) {
      console.error("Tarif detayı alınamadı", err);
      // Gerekirse yönlendirme yapabilirsin (ancak context'te yönlendirme mantıklı değil)
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecipeLikeCount = useCallback(async (recipeId) => {
    try {

      const data = await getRecipeLikeCount(recipeId);
      if (data.status === 'success') {
        setRecipeLikeCount(data.like_count);
      } else {
        setRecipeLikeCount(0);
      }
    } catch (error) {
      console.error("Beğeni sayısı alınamadı", error);
      return null;
    }
  }, []);

  const fetchRecipeBookmarkCount = useCallback(async (recipeId) => {
    try {

      const data = await getRecipeBookmarkCount(recipeId);
      if (data.status === 'success') {
        setRecipeBookmarkCount(data.bookmark_count);
      } else {
        setRecipeBookmarkCount(0);
      }
    } catch (error) {
      console.error("Beğeni sayısı alınamadı", error);
      return null;
    }
  }, []);

  const fetchMostViewedRecipes = useCallback(async () => {
    try {
      const data = await getMostViewedRecipes();
      if (data.status === 'success') {
        return data.recipes;
      }
      else { return null }
    }
    catch (error) {
      console.error("Tarifler alınamadı", error);
      return null;
    }
  }, [])

  const fetchMostLikedRecipes = useCallback(async () => {
    try {
      const data = await getMostLikedRecipes();
      if (data.status === 'success') {
        return data.recipes;
      }
      else { return null }
    }
    catch (error) {
      console.error("Tarifler alınamadı", error);
      return null;
    }
  }, [])

  const fetchAddLastRecipes = useCallback(async () => {
    try {
      const data = await getAddLastRecipes();
      if (data.status === 'success') {
        return data.recipes;
      }
      else { return null }
    }
    catch (error) {
      console.error("Tarifler alınamadı", error);
      return null;
    }
  }, [])


  const fetchRecipeAddComment = useCallback(async (recipeId, commentData) => {
    return await addCommentToRecipe(recipeId, commentData);
  }, []);

  const fetchRecipeDeleteComment = useCallback(async (recipeId, commentId, userID) => {
    return await deleteCommentFromRecipe(recipeId, commentId, userID);
  }, []);

  return (
    <RecipeContext.Provider value={{
      recipeList,
      recipeCategoryList,
      paginationInfo,
      hasMore,
      page,
      loading,
      fetchRecipes,
      fetchRecipeCategories,
      recipeLikeCount,
      recipeDetail,
      fetchRecipeDetail,
      fetchRecipeLikeCount,
      fetchRecipeBookmarkCount,
      recipeBookmarkCount,
      fetchMostViewedRecipes,
      fetchMostLikedRecipes,
      fetchAddLastRecipes,
      fetchRecipeAddComment,
      fetchRecipeDeleteComment
    }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => useContext(RecipeContext);
