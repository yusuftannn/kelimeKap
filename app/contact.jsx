import InfoPage from "../src/components/InfoPage";

export default function Contact() {
  return (
    <InfoPage
      title="İletişim"
      intro="Önerilerin, hata bildirimlerin veya öğrenme deneyiminle ilgili düşüncelerin bizim için değerli."
      sections={[
        {
          title: "Geri bildirim gönder",
          body: "Uygulamadaki bir sorunu veya geliştirme önerini bize e-posta ile iletebilirsin.",
        },
        {
          title: "Yanıt süresi",
          body: "Mesajlarını mümkün olduğunca kısa sürede inceleyip geri dönüş yaparız.",
        },
      ]}
    />
  );
}