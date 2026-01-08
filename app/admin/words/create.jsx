import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { View } from "react-native";
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

  const save = async () => {
    if (!en || !tr || !level) return;

    await addDoc(collection(db, "words"), {
      en,
      tr,
      example_en: exampleEn,
      example_tr: exampleTr,
      level,
      createdAt: new Date(),
    });
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

        <Button title="Kaydet" onPress={save} />
      </View>
    </AdminGuard>
  );
}
