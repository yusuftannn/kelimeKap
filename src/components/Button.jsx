import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Button({
  title,
  leftIcon,
  onPress,
  variant = "primary",
  style,
  iconSize = 20,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[styles.icon, { width: iconSize, height: iconSize }]}
            resizeMode="contain"
          />
        )}

        <Text
          style={[styles.text, variant === "secondary" && styles.secondaryText]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primary: {
    backgroundColor: "#2E609B",
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
