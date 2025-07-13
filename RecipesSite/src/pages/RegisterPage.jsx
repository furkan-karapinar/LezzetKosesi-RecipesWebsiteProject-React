import React, { useState, useCallback } from 'react';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    Calendar,
    ChefHat,
    Check,
    ArrowLeft,
    Facebook,
    Heart
} from 'lucide-react';
import { registeruser } from '../api/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        fullname: '',
        gender: '',
        passwd: '',
        about: '',
        terms: false
    });

    const fetchRegisterUser = useCallback(async (formData) => {
        const data = await registeruser(formData);
        return data;
    }, [])

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});

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

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.fullname.trim()) newErrors.fullname = 'Ad Soyad gereklidir';
            if (!formData.email.trim()) newErrors.email = 'E-posta gereklidir';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli bir e-posta adresi girin';
            if (!formData.phone.trim()) newErrors.phone = 'Telefon alanı gereklidir';
            if (!formData.gender.trim()) newErrors.gender = 'Cinsiyet gereklidir';
        }

        if (step === 2) {
            if (!formData.address.trim()) newErrors.address = 'Adres gereklidir';
            if (!formData.city.trim()) newErrors.city = 'Şehir gereklidir';
            if (!formData.country.trim()) newErrors.country = 'Ülke gereklidir';
        }

        if (step === 3) {
            if (!formData.username.trim()) newErrors.username = 'Kullanıcı adı gereklidir';
            if (!formData.passwd) newErrors.passwd = 'Şifre gereklidir';
            if (!formData.terms) newErrors.terms = 'Kullanım koşullarını kabul etmelisiniz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            const registeruser = async () => {
                const result = await fetchRegisterUser(formData)

                if (result.status == 'success') {
                    alert('Kayıt Başarılı Hoşgeldiniz :)');
                    window.location.href = "/login";
                }
                else {
                    alert('Kayıt Başarısız GG :(')
                }
            }
            registeruser()
        }
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.passwd);

    return (
        <div className="min-h-screen bg-gradient-to-r from-red-600 to-red-800">


            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Info */}
                    <div className="hidden lg:block">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ChefHat className="w-12 h-12 text-red-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Lezzet Köşesine Hoş Geldin!
                            </h1>
                            <p className="text-lg text-gray-100 mb-8">
                                Binlerce tarif ve mutfak ipuçlarıyla dolu platformumuza katıl
                            </p>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="text-gray-100">Kişiselleştirilmiş tarif önerileri</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="text-gray-100">Favori tariflerini kaydet</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="text-gray-100">Kendi tariflerini paylaş</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="text-gray-100">Mutfak topluluğuna katıl</span>
                                </div>
                                <div className="flex flex-col items-center justify-center space-x-3 gap-6">
                                    <div className="text-lg text-gray-200 pt-6">
                                        Zaten hesabınız var mı?
                                        <button onClick={() => { window.location.href = "/login" }} className="text-white ml-1 underline font-medium cursor-pointer">
                                            Giriş Yap
                                        </button>
                                    </div>
                                    <button onClick={() => { window.location.href = "/" }} className="flex items-center text-white hover:underline transition-colors cursor-pointer">
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Ana Sayfaya Dön
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Adım {currentStep} / 3</span>
                                <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Tamamlandı</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
                                />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kişisel Bilgiler</h2>
                                        <p className="text-gray-600">Hesabınızı oluşturmak için temel bilgilerinizi girin</p>
                                    </div>

                                    <div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tam Ad *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="fullname"
                                                    value={formData.fullname}
                                                    onChange={handleInputChange}
                                                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.fullname ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Adınız ve Soyadınız"
                                                />
                                            </div>
                                            {errors.fullname && (
                                                <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            E-posta *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="ornek@email.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefon *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="05XX XXX XX XX"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cinsiyet *
                                            </label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.gender ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                            >
                                                <option value="">Seçiniz</option>
                                                <option value="male">Erkek</option>
                                                <option value="female">Kadın</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>)}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kişisel Bilgiler</h2>
                                        <p className="text-gray-600">Hesabınızı oluşturmak için temel bilgilerinizi girin</p>
                                    </div>

                                    <div className="">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Adres *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.address ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Adresiniz"
                                                />
                                            </div>
                                            {errors.address && (
                                                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ülke *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.country ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Türkiye"
                                            />
                                        </div>
                                        {errors.country && (
                                            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Şehir *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.city ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="İstanbul"
                                            />
                                        </div>
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                                        )}
                                    </div>
                                </div>)}


                            {/* Step 3: Password and Additional Info */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Güvenlik ve Ek Bilgiler</h2>
                                        <p className="text-gray-600">Hesabınızın güvenliği için güçlü bir şifre oluşturun</p>
                                    </div>

                                    <div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kullanıcı Adı *
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.username ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Kullanıcı adınızı girin"
                                            />
                                            {errors.username && (
                                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Şifre *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="passwd"
                                                value={formData.passwd}
                                                onChange={handleInputChange}
                                                className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.passwd ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="En az 8 karakter"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.passwd && (
                                            <p className="mt-1 text-sm text-red-600">{errors.passwd}</p>
                                        )}

                                        {/* Password Strength */}
                                        {formData.passwd && (
                                            <div className="mt-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength < 2 ? 'bg-red-500' :
                                                                passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {passwordStrength < 2 ? 'Zayıf' :
                                                            passwordStrength < 4 ? 'Orta' : 'Güçlü'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Şifre Tekrarı *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Şifrenizi tekrar girin"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            checked={formData.terms}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5"
                                        />
                                        <label className="text-sm text-gray-700">
                                            <span className="text-red-600">*</span> Kullanım koşullarını ve gizlilik politikasını kabul ediyorum
                                        </label>
                                    </div>
                                    {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Geri
                                    </button>
                                )}

                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
                                    >
                                        İleri
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto flex items-center"
                                    >
                                        <Heart className="w-5 h-5 mr-2" />
                                        Hesabımı Oluştur
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;