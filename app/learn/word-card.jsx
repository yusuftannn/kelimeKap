import { View } from "react-native";
import Button from "../../src/components/Button";
import WordCard from "../../src/components/WordCard";
import { useWordStore } from "../../src/store/useWordStore";

export default function WordCardScreen() {
  const { words, currentIndex, nextWord } = useWordStore();
  const word = words[currentIndex];

  if (!word) return null;

  return (
    <View style={{ padding: 24 }}>
      <WordCard front={word.en} back={word.tr} />

      <View style={{ marginTop: 20 }}>
        <Button title="Bilmiyorum" variant="secondary" onPress={nextWord} />
        <Button title="Kaydet" onPress={nextWord} />
        <Button title="Biliyorum" onPress={nextWord} />
      </View>
    </View>
  );
}
