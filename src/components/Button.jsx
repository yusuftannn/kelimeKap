import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Button({ title, onPress, variant = "primary", style }) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  primary: {
    backgroundColor: "#2E6EF7",
  },

  secondary: {
    backgroundColor: "#E8E8E8",
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  secondaryText: {
    color: "#111",
  },
});
