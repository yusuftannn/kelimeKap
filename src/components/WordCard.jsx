import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WordCard({ front, back, exampleEn, exampleTr }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Pressable onPress={() => setFlipped(!flipped)}>
      <View style={styles.card}>
        <Text style={styles.word}>{flipped ? back : front}</Text>

        {flipped && exampleTr && (
          <Text style={styles.example}>{exampleTr}</Text>
        )}
        {!flipped && exampleEn && (
          <Text style={styles.example}>{exampleEn}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
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
