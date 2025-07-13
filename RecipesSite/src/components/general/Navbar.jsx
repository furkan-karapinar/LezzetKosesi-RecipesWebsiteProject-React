import React, { useState, useRef, useEffect, useContext } from 'react'
import { ChefHat, Heart, Menu, UserRound, X, BookMarked, User, Settings, LogOut, Star, NotebookPen, Bookmark, LogIn, Key } from 'lucide-react'
import { UserContext } from '../../contexts/UserContext'; // UserContext'i import et
import { logoutuser, MainApiURL } from '../../api/api';


const Navbar = ({ page_index }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useContext(UserContext); // UserContext'ten user ve setUser fonksiyonlarını al


  const fetchLogout = async () => {
    // Çıkış yapma işlemi
    // Burada API çağrısı yaparak çıkış işlemini gerçekleştirebilirsin
    const res = await logoutuser(localStorage.getItem('token'));
    // Ardından kullanıcıyı anasayfaya yönlendirebilirsin
    if (res) {
      window.location.href = '/'; // Anasayfaya yönlendir
    } else {
      console.error('Çıkış işlemi başarısız oldu.');
    }
  };




  // User verisi useContext ile global olarak kullanılabilir yapılacak //



  // Dropdown dışına tıklanınca menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserIconClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <a href='/' className="flex items-center space-x-2 cursor-pointer">
            <ChefHat className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">LezzetKöşesi</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className={`font-medium hover:text-red-600 transition-colors ${page_index === 0 ? 'text-red-600 active' : 'text-gray-600'}`}>Anasayfa</a>
            <a href="/recipes" className={`font-medium hover:text-red-600 transition-colors ${page_index === 1 ? 'text-red-600 active' : 'text-gray-600'}`}>Tarifler</a>
            <a href="/blogs" className={`font-medium hover:text-red-600 transition-colors ${page_index === 2 ? 'text-red-600 active' : 'text-gray-600'}`}>Blog</a>
            <a href="/contact" className={`font-medium hover:text-red-600 transition-colors ${page_index === 3 ? 'text-red-600 active' : 'text-gray-600'}`}>İletişim</a>
          </nav>

          {/* Right Section (Heart Icon, User Dropdown and Button) */}
          <div className="flex items-center space-x-5">

            {
              (user != null) ? (
                <div className="relative p-2" ref={dropdownRef}>
                  <div
                    className="flex justify-center items-center text-gray-600 hover:text-red-600 space-x-2 cursor-pointer"
                    onClick={handleUserIconClick}
                  >
                    {user?.avatar && !(user?.avatar.includes("null")) ? (
                      <img
                        src={MainApiURL + user?.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (<div className="rounded-full bg-red-200 p-2 flex items-center justify-center">
                      <UserRound className="w-6 h-6 transition-colors" />
                    </div>
                    )}
                    <p>{user?.fullname || "User"}</p>
                  </div>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="py-1">
                        <a
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                        >
                          <UserRound className="w-4 h-4 mr-3" />
                          Profilim
                        </a>

                        <a
                          href="/mybookmarks"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 mr-3" />
                          Kaydettiklerim
                        </a>

                        <a
                          href="/myrecipes"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                        >
                          <BookMarked className="w-4 h-4 mr-3" />
                          Tariflerim
                        </a>

                        <a
                          href="/myblogs"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                        >
                          <NotebookPen className="w-4 h-4 mr-3" />
                          Bloglarım
                        </a>

                      </div>

                      <div className="border-t border-gray-100 py-1">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => {
                            fetchLogout();
                            setIsUserDropdownOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Çıkış
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) :
                (
                  <div className="flex items-center space-x-2">
                    <a href="/login" className="hidden md:inline-flex items-center px-4 py-2 gap-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                      <LogIn className="w-4 h-4" />
                      Giriş Yap
                    </a>
                    <a href="/register" className="hidden md:inline-flex items-center px-4 py-2 gap-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                     <Key className="w-4 h-4" />
                      Kayıt Ol
                    </a>
                  </div>
                )
            }

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-red-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden flex flex-col space-y-4 mt-4">
            <a href="/" className={`font-medium text-gray-600 hover:text-red-600 transition-colors ${page_index === 0 ? 'text-red-600 active' : ''}`}>Anasayfa</a>
            <a href="/recipes" className={`font-medium text-gray-600 hover:text-red-600 transition-colors ${page_index === 1 ? 'text-red-600 active' : ''}`}>Tarifler</a>
            <a href="/blog" className={`font-medium text-gray-600 hover:text-red-600 transition-colors ${page_index === 2 ? 'text-red-600 active' : ''}`}>Blog</a>
            <a href="/contact" className={`font-medium text-gray-600 hover:text-red-600 transition-colors mb-4 ${page_index === 3 ? 'text-red-600 active' : ''}`}>İletişim</a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;