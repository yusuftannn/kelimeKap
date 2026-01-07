import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import AdminGuard from "../../../src/components/AdminGuard";
import PageHeader from "../../../src/components/PageHeader";
import { db } from "../../../src/services/firebase";

export default function AdminWords() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const snap = await getDocs(collection(db, "words"));
    setWords(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  };

  return (
    <AdminGuard>
      <PageHeader title="Kelimeler" />

      <FlatList
        data={words}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1 }}>
            <Text>{item.en} – {item.tr}</Text>
            <Text>{item.level}</Text>
          </View>
        )}
      />
    </AdminGuard>
  );
}
