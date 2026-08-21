import InfoPage from "../src/components/InfoPage";

export default function Privacy() {
  return (
    <InfoPage
      title="Gizlilik Politikası"
      intro="Kişisel bilgilerini yalnızca KelimeKap deneyimini sunmak ve geliştirmek için kullanırız."
      sections={[
        {
          title: "Hesap bilgileri",
          body: "Kayıt olduğunda paylaştığın hesap bilgileri, giriş yapabilmen ve ilerlemeni saklayabilmemiz için kullanılır.",
        },
        {
          title: "Öğrenme verileri",
          body: "Çalışma, doğru-yanlış ve kaydetme bilgilerin kişisel ilerlemeni göstermek amacıyla tutulur.",
        },
        {
          title: "Verilerin üzerinde kontrol",
          body: "Hesabınla ilgili bir talebin olduğunda bizimle iletişime geçebilirsin.",
        },
      ]}
    />
  );
}