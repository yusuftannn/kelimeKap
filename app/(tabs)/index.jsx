import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import baslaIcon from "../../assets/icons/hemen-basla-icon.png";
import homeImg from "../../assets/images/home-img.png";
import Button from "../../src/components/Button";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Home() {
  const level = useAuthStore((s) => s.user?.level);
  const user = useAuthStore((s) => s.user);

  const handleStart = () => {
    if (!user?.level) {
      router.replace("/level-select");
      return;
    }

    router.push("/learn/word-card");
  };

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={homeImg} />
      <View style={styles.content}>
        <Text style={styles.title}>Hazır mısın?</Text>
        <Text style={styles.subtitle}>Seviyen: {level}</Text>
      </View>
      <Button title="Hemen Başla" onPress={handleStart} leftIcon={baslaIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 20, marginBottom: 20, color: "#555" },
  img: { width: "100%", height: 200, resizeMode: "contain", marginBottom: 20 },
  content: { display: "flex", alignItems: "center" },
});
