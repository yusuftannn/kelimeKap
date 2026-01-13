import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { View } from "react-native";
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

      <View style={{ padding: 20 }}>
        <Input placeholder="EN Word" value={en} onChangeText={setEn} />
        <Input placeholder="TR Word" value={tr} onChangeText={setTr} />
        <Input
          placeholder="Example EN"
          value={exampleEn}
          onChangeText={setExampleEn}
        />
        <Input
          placeholder="Example TR"
          value={exampleTr}
          onChangeText={setExampleTr}
        />
        <LevelPicker value={level} onChange={setLevel} />

        <Button
          title={loading ? "Kaydediliyor..." : "Kaydet"}
          onPress={save}
          disabled={loading}
        />
      </View>
    </AdminGuard>
  );
}
