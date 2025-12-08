import { router } from "expo-router";
import { Text, View } from "react-native";
import Button from "../../src/components/Button";
import { useWordStore } from "../../src/store/useWordStore";

export default function Home() {
  const setLevel = useWordStore((s) => s.setLevel);

  const handleStart = (lvl) => {
    setLevel(lvl);
    router.push("/learn/word-card");
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: "700" }}>Kelime Seç</Text>

      {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
        <Button key={lvl} title={lvl} onPress={() => handleStart(lvl)} />
      ))}
    </View>
  );
}
