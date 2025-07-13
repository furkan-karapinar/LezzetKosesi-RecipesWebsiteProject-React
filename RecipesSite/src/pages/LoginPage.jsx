import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ChefHat,
} from 'lucide-react';
import { forgetpassword, loginuser } from '../api/api';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    return newErrors;
  };

  const only_validate_mail = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    return newErrors;
  }

  const onclick_forgetpassword = async () => {

    const newErrors = only_validate_mail();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchForgotPassword();
      if (data.status === 'success') {
        alert(data.message);
      } else {
        alert(data.error || 'Bir hata oluştu, lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error("Hata: ", error);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    }
    finally {
      setIsLoading(false);
    }

  }

  const fetchForgotPassword = async () => {
    try {
      const data = await forgetpassword(formData);
      return data;
    }
    catch (error) {
      console.error("Hata: ", error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Login işlemi burada yapılacak
   
    await fetchLogin();
    setIsLoading(false);

  };

  const fetchLogin = async () => {
    try {
      const data = await loginuser(formData.email, formData.password);

      if (data.token) {
        // Login başarılı, token localStorage'da saklanabilir
        localStorage.setItem('token', data.token);
        // Kullanıcıyı yönlendirme veya başka bir işlem yapabilirsin
        window.location.href = '/'; // Anasayfaya yönlendir
      } else if (data.error) {
        // Hata mesajını kullanıcıya göstermek için kullanabilirsin
        console.error("Login hatası:", data.error);
      }

      return data;
    } catch (error) {
      console.error("Beklenmeyen hata: ", error);
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className=" rounded-full p-4 mr-4">
                <ChefHat className="w-25 h-25 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold text-white mb-2">Lezzet Köşesi</h1>
                <p className="text-2xl text-gray-50">Binlerce enfes tarife erişim</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center mb-6">
                <div className="bg-red-600 rounded-full p-3 mr-3">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Lezzet Köşesi</h1>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz!</h2>
              <p className="text-gray-600">Hesabınıza giriş yapın</p>
            </div>


            {/* Login Form */}
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-red-500'
                      }`}
                    placeholder="ornek@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-red-500'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                

                <button onClick={onclick_forgetpassword} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Şifremi unuttum
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Giriş yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Giriş Yap</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Hesabınız yok mu?{' '}
                <a href="/register" className="text-red-600 hover:text-red-700 font-medium">
                  Kayıt olun
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;