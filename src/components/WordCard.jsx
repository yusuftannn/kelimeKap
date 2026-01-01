import { MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function WordCard({ front, back, exampleEn, exampleTr }) {
  const [flipped, setFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    Animated.timing(animatedValue, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setFlipped(!flipped);
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <Pressable onPress={flipCard}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
            },
          ]}
          pointerEvents={flipped ? "none" : "auto"}
        >
          <Text style={styles.word}>{front}</Text>
          {exampleEn && <Text style={styles.example}>{exampleEn}</Text>}
          <View style={styles.entr}>
            <Text style={styles.hintText}>EN</Text>
          </View>
          <View style={styles.hint}>
            <MaterialIcons name="touch-app" size={20} color="#999" />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.back,
            {
              transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
            },
          ]}
          pointerEvents={flipped ? "auto" : "none"}
        >
          <Text style={styles.word}>{back}</Text>
          {exampleTr && <Text style={styles.example}>{exampleTr}</Text>}
          <View style={styles.entr}>
            <Text style={styles.hintText}>TR</Text>
          </View>
          <View style={styles.hint}>
            <MaterialIcons name="touch-app" size={18} color="#999" />
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 180,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backfaceVisibility: "hidden",
  },
  back: {
    backgroundColor: "#FFF",
  },
  word: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  example: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  entr: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.6,
  },
  hint: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.6,
  },
  hintText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#999",
  },
});
