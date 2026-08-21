import InfoPage from "../src/components/InfoPage";

const sections = [
  {
    title: "1. Seviyeni seç",
    body: "İngilizce seviyeni belirle. KelimeKap, çalışma deneyimini bu seviyeye göre düzenler.",
  },
  {
    title: "2. Kelimeleri çalış",
    body: "Her kartta İngilizce kelimeyi, Türkçe karşılığını ve örnek cümleyi incele.",
  },
  {
    title: "3. Bildiğini işaretle",
    body: "Doğru ve yanlış cevaplarını işaretleyerek ilerle. Böylece istatistiklerin güncellenir.",
  },
  {
    title: "4. Zorlandıklarını tekrar et",
    body: "Kaydettiğin veya zorlandığın kelimelere daha sonra tekrar çalışabilirsin.",
  },
];

export default function HowItWorks() {
  return (
    <InfoPage
      title="Nasıl Çalışır?"
      intro="Kelime öğrenmeyi kısa, düzenli ve takip edilebilir çalışma seanslarına dönüştürüyoruz."
      sections={sections}
    />
  );
}