import React, { useState, useContext, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Edit3,
  Shield,
  Check,
  X,
  Upload
} from 'lucide-react';
import { UserContext } from '../contexts/UserContext';
import { MainApiURL } from '../api/api';
import Navbar from '../components/general/Navbar';


const MyProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Kullanıcı bilgileri state


  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    fullName: user?.fullname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Ankara',
    country: user?.country || 'Türkiye',
    gender: user?.gender || '',
    about: user?.about || '',
    avatar: (MainApiURL + user?.avatar) || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    userId: user?.id || '',
    avatarchanged: false, // Avatar değişti mi kontrolü için
  });

  useEffect(() => {
    if (user) {
      setFormData(
        {
          fullName: user?.fullname || '',
          email: user?.email || '',
          phone: user?.phone || '',
          address: user?.address || '',
          city: user?.city || 'Ankara',
          country: user?.country || 'Türkiye',
          gender: user?.gender || '',
          about: user?.about || '',
          avatar: (MainApiURL + user?.avatar) || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          userId: user?.id || '',
          avatarchanged: false, // Avatar değişti mi kontrolü için
        })

      setAvatarPreview(user?.avatar ? (MainApiURL + user.avatar) : null); // Avatar önizlemesi için
    }
  }, [user]);

  const [avatarPreview, setAvatarPreview] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file // ✅ dosya nesnesini doğrudan ata
      }));

      formData.avatarchanged = true; // Avatar değiştiğini işaretle

      // Eğer önizleme gerekiyorsa ayrıca tut
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result); // Bu sadece görselde gösterim için
      };
      reader.readAsDataURL(file);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullname = 'Ad Soyad gerekli';
    if (!formData.email.trim()) errors.email = 'E-posta gerekli';
    if (!formData.phone) errors.phone = 'Telefon numarası gerekli';
    if (!formData.gender) errors.gender = 'Cinsiyet seçimi gerekli';
    if (!formData.address) errors.address = 'Adres gerekli';
    if (!formData.city) errors.city = 'Şehir gerekli';
    if (!formData.country) errors.country = 'Ülke gerekli';
    if (!formData.about) errors.about = 'Hakkında kısmı gerekli';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const form = new FormData();
    form.append("fullname", formData.fullName);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("address", formData.address);
    form.append("gender", formData.gender);
    form.append("about", formData.about);
    form.append("city", formData.city);
    form.append("country", formData.country);
    form.append("userId", formData.userId);
    form.append("avatarchanged", formData.avatarchanged); // Avatar değişti mi kontrolü
    // Şifreleri ekle
    if (formData.currentPassword) {
      form.append("currentPassword", formData.currentPassword);
    }
    if (formData.newPassword) {
      form.append("newPassword", formData.newPassword);
    }
    if (formData.confirmPassword) {
      form.append("confirmPassword", formData.confirmPassword);
    }


    // Görsel dosyası varsa ekle
    if (formData.avatar) {
      form.append("image", formData.avatar);
    }


    try {
      const res = await fetch("http://localhost:3000/api/v1/users/mainuser/", {
        method: "POST",
        body: form // FormData gönderiyoruz
      });

      setIsSubmitting(false);

      if (res.ok) {
        alert("Profil başarıyla gönderildi!");
      } else {
        const err = await res.json();
        alert("Hata: " + err.error);
      }
    } catch (error) {
      console.error("Sunucuya bağlanırken hata:", error);
      alert("Sunucu hatası");
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Kişisel Bilgiler', icon: User },
    { id: 'security', label: 'Güvenlik ve Hesap', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-slide-in">
          <Check className="w-5 h-5 mr-2" />
          Profil başarıyla güncellendi!
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-12 text-white relative">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar Upload */}
              <div className="relative group">
                {avatarPreview && <img
                  src={avatarPreview}
                  alt="Profil Resmi"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />}
                <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">{formData.fullName}</h2>
                <p className="text-red-100 mt-1">{formData.email}</p>
                <div className="flex items-center justify-center md:justify-start mt-2 text-red-100">
                  <MapPin className="w-4 h-4 mr-1" />
                  {formData.city}, {formData.country}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'border-b-2 border-red-500 text-red-600 bg-red-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'personal' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2 text-red-600" />
                    Kişisel Bilgiler
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Ad Soyad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Adınızı ve soyadınızı girin"
                          required
                        />
                      </div>
                    </div>

                    {/* E-posta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta Adresi *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="E-posta adresinizi girin"
                          required
                        />
                      </div>
                    </div>

                    {/* Telefon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon Numarası
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Telefon numaranızı girin"
                        />
                      </div>
                    </div>

                    {/* Cinsiyet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cinsiyet
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      >
                        <option value="">Seçiniz</option>
                        <option value="female">Kadın</option>
                        <option value="male">Erkek</option>
                      </select>
                    </div>

                    {/* Şehir */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şehir
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Şehrinizi girin"
                        />
                      </div>
                    </div>

                    {/* Ülke */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ülke
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Ülkenizi girin"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adres */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                      placeholder="Tam adresinizi girin"
                    />
                  </div>

                  {/* Hakkında */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hakkımda
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                      placeholder="Kendiniz hakkında birkaç cümle yazın..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Bu bilgi profilinizde görüntülenecektir.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-600" />
                    Güvenlik Ayarları
                  </h3>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Güvenlik Uyarısı:</strong> Şifrenizi değiştirmek için mevcut şifrenizi girmeniz gerekir.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Mevcut Şifre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mevcut Şifre
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Mevcut şifrenizi girin"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Yeni Şifre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yeni Şifre
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Yeni şifrenizi girin"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        En az 8 karakter, büyük harf, küçük harf ve sayı içermelidir.
                      </p>
                    </div>

                    {/* Şifre Onayı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yeni Şifre (Tekrar)
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Yeni şifrenizi tekrar girin"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          Şifreler eşleşmiyor
                        </p>
                      )}
                      {formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <Check className="w-4 h-4 mr-1" />
                          Şifreler eşleşiyor
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hesabı Dondur */}
                {/* <div className='py-4'>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-600" />
                    Hesabı Dondur
                  </h3>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Uyarı:</strong> Hesabınız siz tekrar giriş yapılasaya kadar devre dışı bırakılır.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <button
                      type="button"
                      onClick={he}
                      disabled={isLoading}
                      className="sm:flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                    >Hesabı Dondur</button>
                  </div>
                </div> */}
              </div>
            )}
            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="sm:flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
};

export default MyProfilePage;