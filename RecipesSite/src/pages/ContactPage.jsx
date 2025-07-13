import React, { useState } from 'react';
import Navbar from '../components/general/Navbar';
import Hero from '../components/general/Hero';
import { ArrowRight, Mail, Phone, MailCheck } from 'lucide-react';
import Footer from '../components/general/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isSubmittedReset = () => {
    setIsSubmitted(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form data
    setFormData({
      name: '',
      email: '',
      message: '',
    });
    // Here you can handle the form submission to the backend or an API
  };

  return (
     <div className="min-h-screen site_container">
      {/* Header */}
      <Navbar page_index={3} />

      {/* Hero Section */}
      <Hero
        title={`İletişime Geçin`}
        description={"Bizimle her konuda iletişime geçebilirsiniz."}
        showSearchBar={false}
        searchQuery={null}
        setSearchQuery={null}
      />

      {/* Success Message */}
      {isSubmitted && (
      <div className="fixed inset-0 z-50 bg-white bg-op-50 flex flex-col items-center justify-center">
        <div className='flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-2xl'>
          <MailCheck className="w-16 h-16 text-red-500" />
          <p className="mt-4 text-lg text-red-700 font-medium">Mesajınız Gönderildi!</p>
          <p className="text-gray-600">En kısa sürede sizinle iletişime geçeceğiz.</p>
        <button onClick={isSubmittedReset} className='mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium'>
          Tamam
        </button>
        </div>
      </div>
      )}

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Contact Form */}

            <form onSubmit={handleSubmit} className="p-6 col-span-2">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-gray-700 font-medium">Adınız</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium">E-posta Adresiniz</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-gray-700 font-medium">Mesajınız</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                ></textarea>
              </div>


              <button
                type="submit"
                className="bg-red-600 text-white py-3 px-8 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                Mesaj Gönder
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>




            </form>

            {/* Contact Info */}
            <div className="p-6 col-span-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h3>
              <p className="text-gray-600 mb-2">
                <Mail className="w-5 h-5 text-red-600 inline-block mr-2" />
                info@lezzetkosesi.com
              </p>
              <p className="text-gray-600 mb-2">
                <Phone className="w-5 h-5 text-red-600 inline-block mr-2" />
                +90 123 456 789
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Sosyal Medya</h3>
              <p className="text-gray-600">Bizi sosyal medyada takip edin:</p>
              <div className="flex space-x-6 mt-4">
                <a href="#" className="text-red-600 hover:text-red-800 transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-red-600 hover:text-red-800 transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-red-600 hover:text-red-800 transition-colors">
                  Twitter
                </a>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
