import React, { useState, useContext, useEffect } from 'react';
import { ChefHat, Upload, Save, X, Plus, Minus, Clock, Users, Star, ArrowLeft, Eye, FileImage } from 'lucide-react';
import Navbar from '../components/general/Navbar';
import Hero from '../components/general/Hero';
import { RecipeContext } from '../contexts/RecipeContext';
import { UserContext } from '../contexts/UserContext';
import { MainApiURL } from '../api/api';

const AddRecipePage = ({ editmode = false }) => {

  const { user } = useContext(UserContext);
  const recipe_id = editmode ? new URLSearchParams(window.location.search).get('id') : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    reading_time: '',
    difficulty: 'Kolay',
    servings: '',
    category_id: '',
    chef: '',
    ingredients: [''],
    content: '',
    user_id: user?.id // Mock user ID
  });

  useEffect(() => {
    if (user) {
      // Eğer kullanıcı bilgisi varsa formData'yı güncelle
      setFormData(prev => ({
        ...prev,
        user_id: user.id
      }));
    }
    if (editmode && recipe_id) {
      // Eğer düzenleme modunda ve tarif ID'si varsa, tarif verilerini yükle
      const fetchRecipe = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/recipes/${recipe_id}`);
          if (!response.ok) throw new Error('Tarif bulunamadı');
          const dataa = await response.json();
          const recipe = dataa.recipe;
          setFormData({
            title: recipe.title,
            description: recipe.description,
            image: recipe.image,
            reading_time: recipe.reading_time,
            difficulty: recipe.difficulty,
            servings: recipe.servings,
            category_id: recipe.category_id,
            ingredients: recipe.ingredients.split(', ').map(ing => ing.trim()).filter(ing => ing), // Malzemeleri diziye çevir
            content: recipe.content
          });
          setImagePreview(MainApiURL + recipe.image); // Görsel önizlemesini ayarla
        } catch (error) {
          console.error('Tarif yüklenirken hata:', error);
        }
      };
      fetchRecipe();

    }
  }, [user, recipe_id]);

  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Tarif başlığı gerekli';
    if (!formData.description.trim()) errors.description = 'Açıklama gerekli';
    if (!formData.category_id) errors.category_id = 'Kategori seçimi gerekli';
    if (!formData.difficulty) errors.difficulty = 'Zorluk seviyesi gerekli';
    if (!formData.servings) errors.servings = 'Porsiyon bilgisi gerekli';
    if (!formData.reading_time || formData.reading_time <= 0) errors.reading_time = 'Hazırlık süresi geçerli bir sayı olmalı';
    if (!formData.image) errors.image = 'Görsel seçimi gerekli';
    if (!formData.ingredients.some(item => item.trim())) errors.ingredients = 'En az bir malzeme girilmelidir';
    if (!formData.content.trim()) errors.content = 'Tarif anlatımı gerekli';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };



  const { fetchRecipeCategories, recipeCategoryList } = useContext(RecipeContext);

  useEffect(() => {
    // Kategorileri yükle
    fetchRecipeCategories();
  }, [fetchRecipeCategories]);


  const difficultyOptions = ['Kolay', 'Orta', 'Zor'];
  const servingOptions = ['1', '2', '3-4', '4-6', '6+'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? value : ingredient
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category_id", formData.category_id);
    form.append("difficulty", formData.difficulty);
    form.append("servings", formData.servings);
    form.append("reading_time", formData.reading_time);
    form.append("content", formData.content);
    form.append("user_id", formData.user_id);

    // Malzemeleri dizi olarak yolla
    formData.ingredients.forEach((ing) => form.append("ingredients[]", ing));

    // Görsel dosyası varsa ekle
    if (formData.imageFile) {
      form.append("image", formData.imageFile);
    }

    try {
      if (editmode && recipe_id) {
        const res = await fetch(`http://localhost:3000/api/v1/users/${user.id}/recipes/${recipe_id}`, {
          method: "PUT",
          body: form
        });

        setIsSubmitting(false);

        if (res.ok) {
          alert("Tarif başarıyla güncellendi!");
        } else {
          const err = await res.json();
          alert("Hata: " + err.error);
        }
      }
      else {
        const res = await fetch("http://localhost:3000/api/v1/recipes/add", {
          method: "POST",
          body: form // FormData gönderiyoruz
        });

        setIsSubmitting(false);

        if (res.ok) {
          alert("Tarif başarıyla gönderildi!");
        } else {
          const err = await res.json();
          alert("Hata: " + err.error);
        }
      }

    } catch (error) {
      console.error("Sunucuya bağlanırken hata:", error);
      alert("Sunucu hatası");
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen site_container">
      {/* Header */}
      <Navbar />

      <Hero title={"Yeni Tarif Ekle"} description={"Lezzetli ve efsane tariflerinizi herkesle paylaşın"} showSearchBar={false} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ChefHat className="w-5 h-5 mr-2 text-red-600" />
              Temel Bilgiler
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-1 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarif Başlığı *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Örnek: Enfes Tavuklu Pilav"
                    required
                  />
                  {formErrors.title && <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kısa Açıklama *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="9"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Tarifinizin kısa açıklaması..."
                    required
                  />
                  {formErrors.description && <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>}
                </div>

              </div>

              <div className="md:col-span-1 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {recipeCategoryList.map((category, index) => (
                      index === 0 ? null : (
                        <option key={category.id} value={category.id}>
                          {category.category_name}
                        </option>
                      )
                    ))}
                  </select>
                  {formErrors.category_id && <p className="text-sm text-red-600 mt-1">{formErrors.category_id}</p>}
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zorluk Seviyesi *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    {difficultyOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {formErrors.difficulty && <p className="text-sm text-red-600 mt-1">{formErrors.difficulty}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kaç Kişilik *
                  </label>
                  <select
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Porsiyon Seçin</option>
                    {servingOptions.map(option => (
                      <option key={option} value={option}>{option} Kişilik</option>
                    ))}
                  </select>
                  {formErrors.servings && <p className="text-sm text-red-600 mt-1">{formErrors.servings}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hazırlama Süresi (dakika) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="reading_time"
                      value={formData.reading_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                      placeholder="30"
                      min="1"
                      required
                    />
                    <Clock className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    {formErrors.reading_time && <p className="text-sm text-red-600 mt-1">{formErrors.reading_time}</p>}
                  </div>
                </div>
              </div>


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
              {formErrors.image && <p className="text-sm text-red-600 mt-2">{formErrors.image}</p>}
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-600" />
                Malzemeler
              </h2>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Malzeme Ekle
              </button>
              {formErrors.ingredients && <p className="text-sm text-red-600 mt-1">{formErrors.ingredients}</p>}
            </div>

            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Örnek: 2 su bardağı pirinç"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-red-600" />
              Tarif Anlatımı
            </h2>

            <div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Örnek:&#10;&nbsp;&nbsp;&nbsp;Hazırlık Aşamaları...&#10;&nbsp;&nbsp;&nbsp;Pişirme Süreci..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Her adımı yeni satırda numaralandırarak yazın
              </p>
            </div>
            {formErrors.content && <p className="text-sm text-red-600 mt-1">{formErrors.content}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && !editmode ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  { !editmode ? "Tarifi Yayınla" : "Değişiklikleri Kaydet"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipePage;