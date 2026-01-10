import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function CustomToast({ type, text1, text2 }) {
  const iconMap = {
    success: {
      name: "checkmark-circle-outline",
      color: "#16a34a",
    },
    error: {
      name: "close-circle-outline",
      color: "#dc2626",
    },
    info: {
      name: "information-circle-outline",
      color: "#2563eb",
    },
  };

  const icon = iconMap[type] || iconMap.info;
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon.name}
        size={22}
        color={icon.color}
        style={{ marginRight: 10 }}
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => Toast.hide()}>
        <Ionicons name="close" size={20} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    minWidth: "90%",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: "#555",
  },
});
