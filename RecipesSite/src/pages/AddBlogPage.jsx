import React, { useState, useEffect, useContext } from 'react';
import {
  Send,
  X,
  AlertCircle,
  Check,
  Camera, FileImage, Upload
} from 'lucide-react';
import Navbar from '../components/general/Navbar';
import { BlogContext } from '../contexts/BlogContext';
import { UserContext } from '../contexts/UserContext';
import { MainApiURL } from '../api/api';

const AddBlogPage = ({ editmode = false }) => {

  const { user } = useContext(UserContext);
  const blog_id = editmode ? new URLSearchParams(window.location.search).get('id') : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    reading_time: '',
    image: null,
    user_id: user ? user.id : null // Kullanıcı ID'si, oturum açmış kullanıcıdan alınır
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { blogCategoryList, fetchBlogCategories } = useContext(BlogContext);

  useEffect(() => {
    // Kategorileri yükle
    fetchBlogCategories();

  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Hataları temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };




  useEffect(() => {
    if (user) {
      // Eğer kullanıcı bilgisi varsa formData'yı güncelle
      setFormData(prev => ({
        ...prev,
        user_id: user.id
      }));
    }
    if (editmode && blog_id) {
      // Eğer düzenleme modunda ve blog ID'si varsa, blog verilerini yükle
      const fetchBlog = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/blogs/${blog_id}`);
          if (!response.ok) throw new Error('Blog bulunamadı');
          const dataa = await response.json();
          const blog = dataa.blog;
          setFormData({
            title: blog.title,
            description: blog.description,
            content: blog.content,
            category: blog.category_id,
            reading_time: blog.reading_time,
            image: blog.image,
          });
          setImagePreview(MainApiURL + blog.image); // Görsel önizlemesini ayarla
        } catch (error) {
          console.error('Blog yüklenirken hata:', error);
        }
      };
      fetchBlog();

    }
  }, [user, blog_id]);


  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık zorunludur.';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Başlık en az 10 karakter olmalıdır.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama zorunludur.';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Açıklama en az 20 karakter olmalıdır.';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'İçerik zorunludur.';
    } else if (formData.content.length < 100) {
      newErrors.content = 'İçerik en az 100 karakter olmalıdır.';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori seçimi zorunludur.';
    }

    if (!formData.reading_time) {
      newErrors.reading_time = 'Okuma süresi zorunludur.';
    }

    if (!formData.image) {
      newErrors.image = 'Kapak görseli yüklenmesi zorunludur.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Form verilerini hazırla
      const blogData = new FormData();
      blogData.append('title', formData.title);
      blogData.append('description', formData.description);
      blogData.append('content', formData.content);
      blogData.append('category_id', formData.category);
      blogData.append('reading_time', formData.reading_time);
      blogData.append('user_id', user.id); // Örnek kullanıcı ID'si, gerçek uygulamada oturum açmış kullanıcının ID'sini kullanmalısınız
      if (formData.image) {
        blogData.append('image', formData.image);
      }

      try {
        if (editmode && blog_id) {
          const res = await fetch(`http://localhost:3000/api/v1/users/${user.id}/blogs/${blog_id}`, {
            method: "PUT",
            body: blogData // FormData gönderiyoruz
          });

          setIsSubmitting(false);

          if (res.ok) {
            alert("Blog başarıyla güncellendi!");
          } else {
            const err = await res.json();
            alert("Hata: " + err.error);
          }
        }
        else {
          const res = await fetch("http://localhost:3000/api/v1/blogs/add", {
            method: "POST",
            body: blogData // FormData gönderiyoruz
          });

          setIsSubmitting(false);

          if (res.ok) {
            alert("Blog başarıyla gönderildi!");
          } else {
            const err = await res.json();
            alert("Hata: " + err.error);
          }
        }

      } catch (error) {
        console.error("Sunucuya bağlanırken hata:", error);
        alert("Sunucu hatası");
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess(true);

      if (editmode && blog_id) {
        // Eğer düzenleme modunda ise, sayfayı güncelle
        window.location.href = `/blogs/${blog_id}`;
      }
      else {
        // Başarılı gönderimden sonra anasayfaya yönlendir
        // Formu temizle
        setFormData({
          title: '',
          description: '',
          content: '',
          category: '',
          reading_time: '',
          image: null
        });
        setImagePreview(null);
      }


    } catch (error) {
      console.error('Blog gönderimi başarısız:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({ ...prev, image: file.name, imageFile: file }));

      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Success Message */}
      {submitSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Blog yazınız başarıyla gönderildi!
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni Blog Yazısı</h1>
                <p className="text-gray-600">Yemek tarifleri ve deneyimlerinizi paylaşın</p>
              </div>

              <div className="space-y-6">
                {/* Başlık */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Yazınız için çekici bir başlık yazın..."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Açıklama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kısa Açıklama *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Yazınızın kısa bir özetini yazın..."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.description.length}/200 karakter
                  </p>
                </div>

                {/* Kategori ve Okuma Süresi */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Kategori seçin</option>
                      {blogCategoryList?.map((category) => category.id != 0 ? (
                        <option key={category.id} value={category.id}>
                          {category.category_name}
                        </option>
                      ) : "")}
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Okuma Süresi *
                    </label>
                    <input
                      name="reading_time"
                      value={formData.reading_time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.reading_time ? 'border-red-500' : 'border-gray-300'
                        }`} placeholder='Okuma süresi (dakika cinsinden) yazın...'
                      type="number"
                    />
                    {errors.reading_time && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.reading_time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FileImage className="w-5 h-5 mr-2 text-red-600" />
                    Görsel
                  </h2>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-48 mx-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Tarif görselinizi yükleyin</p>
                        <p className="text-sm text-gray-500">PNG, JPG, JPEG (Maks. 5MB)</p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                    >
                      Görsel Seç
                    </label>
                    {errors.image && <p className="text-sm text-red-600 mt-2">{errors.image}</p>}
                  </div>
                </div>

                {/* İçerik */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    placeholder="Blog yazınızın içeriğini buraya yazın. Tarif adımlarını, malzemeleri ve ipuçlarını detaylandırın..."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${errors.content ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.content}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.content.length} karakter
                  </p>
                </div>



                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium text-lg flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Blog Yazısını Yayınla
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddBlogPage;