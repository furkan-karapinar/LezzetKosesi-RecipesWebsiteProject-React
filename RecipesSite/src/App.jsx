import './App.css'
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/RecipesHomepage'
import RecipesPage from './pages/RecipesPage'
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import NotFound from './pages/NotFound';
import BlogPostPage from './pages/BlogPostPage';
import { GetCurrentUser, GetMainUserApi } from './api/api';
import { UserProvider, UserContext } from './contexts/UserContext';
import RecipePostPage from './pages/RecipePostPage';
import ProfilePage from './pages/ProfilePage';
import { GlobalProvider } from './contexts/GlobalContext';
import AddRecipePage from './pages/AddRecipePage';
import MyProfilePage from './pages/MyProfilePage';
import AddBlogPage from './pages/AddBlogPage';
import RecipeManagement from './pages/RecipeManagement';
import BlogManagement from './pages/BlogManagement';
import MyBookmarks from './pages/MyBookmarks';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';

function AppContent() {
  const { setUser } = useContext(UserContext); // işte burada context'ten alıyorsun

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
    }

    if (token) {
      GetCurrentUser(token).then((res) => {
        if (res.error) {
          console.error('Kullanıcı bilgisi alınamadı:', res.error);
        } else {
          const fetchUser = async () => {
            const data = await GetMainUserApi(res.id);
            setUser(data); // context'e kullanıcıyı kaydet
          };
          fetchUser();
        }
      });
    }


  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipePostPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:id" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Kullanıcıya özel sayfalar */}


        <Route path="/recipes/addnewrecipe" element={<ProtectedRoute><AddRecipePage /></ProtectedRoute>} />
        <Route path="/recipes/editrecipe" element={<ProtectedRoute><AddRecipePage editmode={true} /></ProtectedRoute>} />
        <Route path="/blogs/addnewblog" element={<ProtectedRoute><AddBlogPage /></ProtectedRoute>} />
        <Route path="/blogs/editblog" element={<ProtectedRoute><AddBlogPage editmode={true} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/myprofile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
        <Route path="/myrecipes" element={<ProtectedRoute><RecipeManagement /></ProtectedRoute>} />
        <Route path="/mybookmarks" element={<ProtectedRoute><MyBookmarks /></ProtectedRoute>} />
        <Route path="/myblogs" element={<ProtectedRoute><BlogManagement /></ProtectedRoute>} />

        { /* Not Found Sayfası */ }
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}


function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>

  );
}


export default App
