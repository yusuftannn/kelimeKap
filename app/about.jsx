import InfoPage from "../src/components/InfoPage";

export default function About() {
  return (
    <InfoPage
      title="Hakkımızda"
      intro="KelimeKap, İngilizce kelime dağarcığını günlük pratikle geliştirmek için tasarlanmış sade bir öğrenme uygulamasıdır."
      sections={[
        {
          title: "Amacımız",
          body: "Kısa tekrarları, anlaşılır örnekleri ve kişisel ilerleme takibini tek bir yerde buluşturmak.",
        },
        {
          title: "Öğrenme yaklaşımımız",
          body: "Düzenli tekrarın ve kişinin zorlandığı kelimelere yeniden dönmesinin kalıcı öğrenmeyi desteklediğine inanıyoruz.",
        },
      ]}
    />
  );
}