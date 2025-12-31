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
          style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}
        >
          <Text style={styles.word}>{front}</Text>
          {exampleEn && <Text style={styles.example}>{exampleEn}</Text>}
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.back,
            { transform: [{ rotateY: backInterpolate }] },
          ]}
        >
          <Text style={styles.word}>{back}</Text>
          {exampleTr && <Text style={styles.example}>{exampleTr}</Text>}
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
});
