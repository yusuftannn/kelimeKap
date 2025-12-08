import { StyleSheet, View } from "react-native";

export default function ProgressBar({ progress = 0 }) {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: "100%",
    backgroundColor: "#EEE",
    borderRadius: 4,
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    backgroundColor: "#2E6EF7",
  },
});
