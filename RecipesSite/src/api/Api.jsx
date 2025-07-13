import React from 'react'

import axios from 'axios'

export const MainApiURL = 'http://localhost:3000';



export async function BaseGET(url, config = {}) {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
}

export async function BasePOST(url, data, config = {}) {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
}

export async function BaseDELETE(url, data = {}, config = {}) {
  try {
    const response = await axios.delete(url, {
      ...config,
      data, // body verisi burada gönderiliyor
    });
    return response.data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
}


export async function BasePUT(url, data, config = {}) {
  try {
    const response = await axios.put(url, data, config);
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
}

export async function SearchRecipesApi(searchQuery) {
  return await BaseGET(`http://localhost:3000/api/v1/recipes?s=${searchQuery}`);
}

export async function GetUserApi(id) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${id}`);
}

export async function GetMainUserApi(id) {
  return await BaseGET(`http://localhost:3000/api/v1/users/mainuser/${id}`);
}

export async function GetUserApiWithUsername(id) {
  return await BaseGET(`http://localhost:3000/api/v1/users/username/${id}`);
}

export async function GetUserRecipesInfoApi(id, page = 1) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${id}/recipes?page=${page}`);
}

export async function DeleteUserRecipeApi(user_id, recipe_id) {
  try {
    const response = await axios.delete(`http://localhost:3000/api/v1/users/${user_id}/recipes/${recipe_id}`);
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
}

export async function DeleteUserBlogApi(user_id, blog_id) {
  try {
    const response = await axios.delete(`http://localhost:3000/api/v1/users/${user_id}/blogs/${blog_id}`);
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
}

export async function GetUserBlogsInfoApi(id, page = 1) {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/users/${id}/blogs?page=${page}`);
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
}

export async function BookmarkRecipeApi(user_id, page = 1, search = '', difficulty = '', category = '', time = '', sort = '') {
  return await BaseGET(`http://localhost:3000/api/v1/users/${user_id}/bookmarks/recipes?page=${page}&search=${search}&difficulty=${difficulty}&category=${category}&time=${time}&sort=${sort}`);
}

export async function BookmarkBlogApi(user_id, page = 1, search = '', category = '', time = '', sort = '') {
  return await BaseGET(`http://localhost:3000/api/v1/users/${user_id}/bookmarks/blogs?page=${page}&search=${search}&category=${category}&time=${time}&sort=${sort}`);
}

export async function BlogApiWithPage(page) {
  return await BaseGET(`http://localhost:8000/api/v1/blogs?page=${page}`);
}

export async function BlogApi() {
  return await BaseGET('http://localhost:8000/api/v1/blogs');
}

export async function GetBlogInfo(id) {
  return await BaseGET('http://localhost:3000/api/v1/blogs/' + id);
}

export async function ApiWithPage(page) {
  return await BaseGET(`http://localhost:3000/api/v1/recipes?page=${page}`);
}

export async function RecipeCategoryApi() {
  return await BaseGET('http://localhost:3000/api/v1/recipe-categories');
}

export async function BlogCategoryApi() {
  return await BaseGET('http://localhost:3000/api/v1/blog-categories');
}

export async function RecipeLikesApi(userID) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${userID}/recipes/likes`);
}

export async function RecipeLikeCheckApi(userID, id) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${userID}/recipes/likes/check/${id}`);
}

export async function RecipeBookmarksApi(userID) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${userID}/recipes/bookmarks`);
}

export async function RecipeBookmarkCheckApi(userID, id) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${userID}/recipes/bookmarks/check/${id}`);
}

export async function BlogLikesApi(userID) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${userID}/blogs/likes`);
}

export async function BlogLikeCheckApi(userID, id) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${userID}/blogs/likes/check/${id}`);
}

export async function BlogBookmarksApi(userID) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${userID}/blogs/bookmarks`);
}

export async function BlogBookmarkCheckApi(userID, id) {
  return await BaseGET(`http://localhost:3000/api/v1/users/${userID}/blogs/bookmarks/check/${id}`);
}

export async function getRecipeLikeCount(recipeId) {
  return await BaseGET(`http://localhost:3000/api/v1/recipes/${recipeId}/like-count`);
};

export async function getRecipeBookmarkCount(recipeId) {
  return await BaseGET(`http://localhost:3000/api/v1/recipes/${recipeId}/bookmark-count`);
};

export async function getMostViewedRecipes() {
  return await BaseGET(`http://localhost:3000/api/v1/recipes/mostviewed`)
}

export async function getMostLikedRecipes() {
  return await BaseGET(`http://localhost:3000/api/v1/recipes/mostliked`)
}

export async function getAddLastRecipes() {
  return await BaseGET(`http://localhost:3000/api/v1/recipes/addlast`)
}

export async function getBlogLikeCount(blogId) {
  return await BaseGET(`http://localhost:3000/api/v1/blogs/${blogId}/like-count`);
};

export async function getBlogBookmarkCount(blogId) {
  return await BaseGET(`http://localhost:3000/api/v1/blogs/${blogId}/bookmark-count`);
};

export async function addCommentToRecipe(recipeId, commentData) {
  return await BasePOST(`http://localhost:3000/api/v1/recipes/${recipeId}/comment/add`, commentData)
}

export async function deleteCommentFromRecipe(recipeId, commentId, userID) {
  return await BaseDELETE(`http://localhost:3000/api/v1/recipes/${recipeId}/comment/delete/${commentId}`, { user_id: userID })
}

export async function addCommentToBlog(blogId, commentData) {
  return await BasePOST(`http://localhost:3000/api/v1/blogs/${blogId}/comment/add`, commentData)
}

export async function deleteCommentFromBlog(blogId, commentId, userID) {
  return await BaseDELETE(`http://localhost:3000/api/v1/blogs/${blogId}/comment/delete/${commentId}`, { user_id: userID })
}

export async function registeruser(params) {
  return await BasePOST('http://localhost:3000/api/v1/users/user/register', params)
}

export async function forgetpassword(params) {
  return await BasePOST('http://localhost:3000/api/v1/users/user/forgot-password', params)
}

export async function GetCurrentUser(token) {
  return await BaseGET('http://localhost:3000/api/v1/users/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function loginuser(email, password) {
  const res = await BasePOST('http://localhost:3000/api/v1/users/user/login', {
    email,
    password,
  });
  if (res.token) {
    localStorage.setItem('token', res.token); // frontend'de saklama
  }

  return res;
}


export async function logoutuser(token) {
  const res = await BasePOST('http://localhost:3000/api/v1/users/user/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 'success') {
    localStorage.removeItem('token'); // frontend'den kaldırma
    return true;
  }
  else{
    return false;
  }
}
