# KelimeKap

KelimeKap, kullanıcıların seviyelerine göre İngilizce kelimeler öğrenmesini ve tekrar etmesini sağlayan, modern ve mobil öncelikli bir kelime öğrenme uygulamasıdır. Kullanıcılar seviyelerini seçebilir, kelime kartlarıyla çalışabilir, kelimeleri kaydedebilir ve istatistiklerini takip edebilir.

## Özellikler

- Seviye tabanlı kelime öğrenme
- Kişisel kelime kartları ve tekrar sistemi
- Kaydedilen kelimelerle çalışma
- Kullanıcı profili ve seviye güncelleme
- Öğrenme istatistikleri
- Firebase ile kimlik doğrulama ve veri yönetimi

## Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/yusuftannn/kelimeKap.git
   cd kelimeKap
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Gerekli ortam değişkenlerini `.env` veya `app.json` dosyanıza ekleyin (Firebase anahtarları vb.).
4. Uygulamayı başlatın:
   ```bash
   npx expo start
   ```

## Kullanım

- Uygulama açıldığında giriş yapın veya kayıt olun.
- Seviyenizi seçin ve kelime kartlarıyla çalışmaya başlayın.
- Zorlandığınız kelimeleri kaydedin, istatistiklerinizi takip edin.

## Kullanılan Teknolojiler

- React Native & Expo
- Firebase (Auth, Firestore, Storage)
- Zustand (Global state yönetimi)
- Axios (API istekleri)