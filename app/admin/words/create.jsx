import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AdminGuard from "../../../src/components/AdminGuard";
import Button from "../../../src/components/Button";
import Input from "../../../src/components/Input";
import LevelPicker from "../../../src/components/LevelPicker";
import PageHeader from "../../../src/components/PageHeader";
import { db } from "../../../src/services/firebase";

export default function CreateWord() {
  const [en, setEn] = useState("");
  const [tr, setTr] = useState("");
  const [exampleEn, setExampleEn] = useState("");
  const [exampleTr, setExampleTr] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!en || !tr || !level) {
      Toast.show({
        type: "error",
        text1: "Eksik Bilgi",
        text2: "Tüm alanlar zorunludur.",
      });
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "words"), {
        en,
        tr,
        example_en: exampleEn,
        example_tr: exampleTr,
        level,
        createdAt: new Date(),
      });

      await updateDoc(docRef, {
        wordId: docRef.id,
      });

      setEn("");
      setTr("");
      setExampleEn("");
      setExampleTr("");
      setLevel("");

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Kelime başarıyla eklendi.",
        visibilityTime: 2000,
      });
    } catch (error) {
      console.log("Create word error:", error);

      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Kelime eklenirken bir sorun oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <PageHeader title="Yeni Kelime" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 6,
              }}
            >
              Yeni Kelime Ekle
            </Text>

            <Text
              style={{
                color: "#6B7280",
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              İngilizce kelimeyi ve örnek cümlelerini ekleyin.
            </Text>

            <View style={{ gap: 16 }}>
              <Input
                placeholder="🇺🇸 English Word"
                value={en}
                onChangeText={setEn}
              />

              <Input
                placeholder="🇹🇷 Turkish Meaning"
                value={tr}
                onChangeText={setTr}
              />

              <Input
                placeholder="Example Sentence (EN)"
                value={exampleEn}
                onChangeText={setExampleEn}
              />

              <Input
                placeholder="Örnek Cümle (TR)"
                value={exampleTr}
                onChangeText={setExampleTr}
              />
            </View>

            <View
              style={{
                marginTop: 28,
                paddingTop: 20,
                borderTopWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 12,
                }}
              >
                Seviye
              </Text>

              <LevelPicker value={level} onChange={setLevel} />
            </View>

            <View style={{ marginTop: 32 }}>
              <Button
                title={loading ? "Kaydediliyor..." : "Kelimeyi Kaydet"}
                onPress={save}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AdminGuard>
  );
}
