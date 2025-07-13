# 🍽️ LezzetKöşesi

React öğrenim sürecimin en kapsamlı adımı: sıfırdan tasarımı, veritabanı, REST API ve kullanıcı dostu arayüzüyle modern bir yemek tarifi platformu.

---

## 🚀 Projenin Amacı

Öğrenme yolculuğumda küçük uygulamalar geliştirdikten sonra, öğrendiklerimi birleştireceğim **daha büyük ve gerçek dünya senaryolu bir proje** yapmak istedim.  
LezzetKöşesi, sadece tarif sunmaktan öte; kullanıcı etkileşimi, blog yazıları, kategori filtreleri ve beğenme/favorileme gibi özellikler üzerine kurulu bir yemek tarifi platformu.

---

## 🧩 Teknoloji Yığını & Kullanım Şeklim

### Frontend
- **React** (Create React App / Vite): Bileşen tabanlı yapı, state yönetimi (`useState`, `useEffect`, `useContext`).
- **Tailwind CSS**: Hızlı, duyarlı ve şık tasarım.
- **React Router**: Anasayfa, Tarif Detayı, Blog, Profil gibi sayfalar arasında dinamik geçiş.
- **SweetAlert2** ve **React Icons**: Etkileşimli uyarılar ve kullanıcı deneyimini zenginleştiren görseller.

### Backend & API
- **Node.js + Express**: REST API oluşturmak için kullandım.
- **MySQL**: Tarifler, kullanıcılar, yorumlar, beğeniler, blog içerikleri ve kategoriler için ilişkisel veritabanı.
- **SQL Sorguları**: JSON formatında ilişkili verileri fetch edebilecek JOIN yapıları.
- **Temel CRUD**: Tarif ekleme, güncelleme, silme, kullanıcı işlemleri.
- **Veri Doğrulama**: API tarafında giriş doğrulamaları.

### Destek Teknolojiler / Araçlar
- **Postman**: API testleri için.
- **.env** kullanımı: API anahtarları ve DB bağlantı bilgilerini güvende tutmak için.
- **Claude AI**: Arayüz tasarımında ilk fikir ve şablon desteği, sonrasında ben düzenledim.

---

## 📦 Özellikler

- **Anasayfa**: Trending tarifler, blog yazıları, kategori filtreleriyle zengin içerik.
- **Tarif Detay Sayfası**: Tarif içeriği, yazar bilgisi, yorumlar, beğenme & favoriye ekleme.
- **Blog Sayfası**: Yazı listesi, kategori filtresi, yazı detay sayfası.
- **Kullanıcı Profili**: Kullanıcının favori tarifleri, beğenileri, yazıları.
- **CRUD İşlemleri**: Tarif, blog ve kullanıcı verileri üzerinde tam kontrol.
- **Responsive UI**: Masaüstü ve mobil uyumlu modern tasarım.

---

## 🧠 Öğrendiklerim & Kazanımlar

1. React bileşen yapısı ve state yönetimi.
2. Tailwind ile hızlı stil ve responsive tasarım.
3. Full-stack düşünme: frontend & backend entegrasyonu.
4. REST API & MySQL ilişkisel tasarımı.
5. Postman ile API test ve doğrulama süreci.
6. `.env` kullanma ve temel güvenlik yaklaşımları.
7. Tasarım fikirlerini Claude AI ile başlatıp, manuel özelleştirme deneyimi.

---

## ⚙️ Kurulum & Çalıştırma

1. Repoyu klonla:
    ```bash
    git clone https://github.com/furkan-karapinar/LezzetKosesi-RecipesWebsiteProject-React.git
    cd LezzetKosesi-RecipesWebsiteProject-React
    ```
2. Backend:
    - `recipe-db.sql` veritabanını mysql sunucunuza ekle.
    - `RecipeApi` klasörüne gir, `npm install` yap.
    - `.env` dosyasına DB bilgilerini ekle.
    - `start-server.cmd` ile API’yi çalıştır.
4. Frontend:
    - `RecipeSite` klasörüne gir, `npm install` yap.
    - Gerekirse `./api/api.jsx` içinde BASE API URL’sini belirt.
    - `npm start` ile veya `start-server.cmd` ile siteyi yerelde çalıştır.

---

## 📌 Gelecek Planlarım

- Kullanıcı kayıt/giriş sistemi (JWT tabanlı).
- Yetkilendirme (User/Admin).
- Yorum ve beğeni sistemine gerçek zamanlı güncellemeler.
- Swagger ile API dokümantasyonu.
- Güvenlik: Rate-limiting, input sanitization, password hashing.
- Optimizasyon: Resim sıkıştırma, önbellekleme (caching).
- SEO & erişilebilirlik iyileştirmeleri.

---

## 📎 NOT

Bu proje benim için sadece kod topluluğu değil, **full-stack bir öğrenme deneyimi** oldu.  
React’tan Node.js’e, veritabanı tasarımından API yazmaya kadar yaptığım çok şey var.  
Yorumlarınız, fikirleriniz veya test etmek isteyen herkese kapım açık! 🙌

---

