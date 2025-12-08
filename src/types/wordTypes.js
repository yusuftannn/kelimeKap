export interface Word {
  id: string;
  en: string;     // İngilizce kelime
  tr: string;     // Türkçe anlamı
  example?: string; // Örnek cümle (opsiyonel)
  level: string;    // A1, A2, B1, B2, C1
}
