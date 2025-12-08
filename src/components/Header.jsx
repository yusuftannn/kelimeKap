import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header({ title, back = false }) {
  return (
    <View style={styles.container}>
      {back ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },
});
