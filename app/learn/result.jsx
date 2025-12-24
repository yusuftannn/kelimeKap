import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Result() {
  const { mode } = useLocalSearchParams();
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>
        {mode === "saved"
          ? "Kaydedilenleri Bitirdin 🎉"
          : "Bu Seviyeyi Tamamladın 🎉"}
      </Text>
    </View>
  );
}
