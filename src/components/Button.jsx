import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Button({
  title,
  leftIcon,
  onPress,
  variant = "primary",
  style,
  iconSize = 18,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[styles.icon, { width: iconSize, height: iconSize }]}
          />
        )}
        <Text
          style={[
            styles.text,
            (variant === "outline" || variant === "ghost") && styles.darkText,
          ]}
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
    borderRadius: 16,
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  primary: {
    backgroundColor: "#2E609B",
  },

  success: {
    backgroundColor: "#1F9D55",
  },

  danger: {
    backgroundColor: "#E5533D",
  },

  outline: {
    backgroundColor: "#FFFFFF",
  },

  ghost: {
    backgroundColor: "transparent",
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  darkText: {
    color: "#2E609B",
  },

  icon: {
    tintColor: "#FFF",
  },
});
