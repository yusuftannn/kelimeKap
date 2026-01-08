import { Picker } from "@react-native-picker/picker";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AdminGuard from "../../../src/components/AdminGuard";
import Button from "../../../src/components/Button";
import PageHeader from "../../../src/components/PageHeader";
import { db } from "../../../src/services/firebase";

const LEVELS = ["ALL", "A1", "A2", "B1", "B2", "C1", "C2"];

export default function AdminWords() {
  const [words, setWords] = useState([]);
  const [level, setLevel] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [editWord, setEditWord] = useState(null); 

  useEffect(() => {
    load(level);
  }, [level]);

  const load = async (selectedLevel) => {
    setLoading(true);

    let q =
      selectedLevel === "ALL"
        ? collection(db, "words")
        : query(collection(db, "words"), where("level", "==", selectedLevel));

    const snap = await getDocs(q);

    setWords(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );

    setLoading(false);
  };

  const filteredWords = useMemo(() => {
    if (!search) return words;
    const s = search.toLowerCase();
    return words.filter(
      (w) => w.en?.toLowerCase().includes(s) || w.tr?.toLowerCase().includes(s)
    );
  }, [words, search]);

  const save = async () => {
    if (!editWord) return;

    await updateDoc(doc(db, "words", editWord.id), {
      en: editWord.en,
      tr: editWord.tr,
      example_en: editWord.example_en,
      example_tr: editWord.example_tr,
      level: editWord.level,
    });

    setEditWord(null);
    load(level);
  };

  const removeWord = (word) => {
    Alert.alert(
      "Kelime Sil",
      `"${word.en}" kelimesini silmek istediğine emin misin?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "words", word.id));
            setEditWord(null);
            load(level);
          },
        },
      ]
    );
  };

  return (
    <AdminGuard>
      <PageHeader title="Kelime Yönetimi" />

      <View style={{ padding: 16, gap: 12 }}>
        <TextInput
          placeholder="Kelime ara (EN / TR)"
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 10,
            padding: 12,
            backgroundColor: "#fff",
          }}
        />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {LEVELS.map((l) => (
            <TouchableOpacity
              key={l}
              onPress={() => setLevel(l)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 999,
                backgroundColor: level === l ? "#2563eb" : "#f3f4f6",
              }}
            >
              <Text style={{ color: level === l ? "#fff" : "#000" }}>
                {l === "ALL" ? "Tümü" : l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontSize: 13, color: "#6b7280" }}>
          Toplam: {filteredWords.length} kelime
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={filteredWords}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setEditWord(item)}
              style={{
                marginHorizontal: 16,
                marginBottom: 12,
                padding: 14,
                borderRadius: 12,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text style={{ fontWeight: "700" }}>{item.en}</Text>
              <Text style={{ color: "#6b7280" }}>{item.tr}</Text>

              <Text style={{ fontSize: 12, marginTop: 6 }}>
                EN: {item.example_en}
              </Text>
              <Text style={{ fontSize: 12 }}>TR: {item.example_tr}</Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#3730a3",
                }}
              >
                {item.level}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!editWord} animationType="slide">
        {editWord && (
          <View style={{ padding: 16, gap: 10 }}>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>
              Kelime Düzenle
            </Text>
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              EN
            </Text>
            <TextInput
              placeholder="English"
              value={editWord.en}
              onChangeText={(v) => setEditWord({ ...editWord, en: v })}
              style={input}
            />
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              TR
            </Text>

            <TextInput
              placeholder="Türkçe"
              value={editWord.tr}
              onChangeText={(v) => setEditWord({ ...editWord, tr: v })}
              style={input}
            />
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              EN Örnek
            </Text>

            <TextInput
              placeholder="Example EN"
              value={editWord.example_en}
              onChangeText={(v) => setEditWord({ ...editWord, example_en: v })}
              style={input}
            />
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              TR Örnek
            </Text>
            <TextInput
              placeholder="Example TR"
              value={editWord.example_tr}
              onChangeText={(v) => setEditWord({ ...editWord, example_tr: v })}
              style={input}
            />

            <View>
              <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                Level
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Picker
                  selectedValue={editWord.level}
                  onValueChange={(v) => setEditWord({ ...editWord, level: v })}
                >
                  {LEVELS.map((l) => (
                    <Picker.Item key={l} label={l} value={l} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{ flexDirection: "column", gap: 5 }}>
              <Button title="Kaydet" onPress={save} variant="primary" />
              <Button
                title="İptal"
                onPress={() => setEditWord(null)}
                variant="outline"
              />

              <Button
                title="Kelimeyi Sil"
                onPress={() => removeWord(editWord)}
                variant="danger"
              />
            </View>
          </View>
        )}
      </Modal>
    </AdminGuard>
  );
}

const input = {
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 8,
  padding: 10,
  backgroundColor: "#fff",
};
