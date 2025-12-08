export const Colors = {
  primary: "#2E6EF7",
  secondary: "#E8E8E8",
  text: "#111",
  background: "#FFFFFF",
  darkText: "#FFFFFF",
  darkBackground: "#111111",
  danger: "#FF4D4D",
  success: "#2ECC71",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: "700" },
  h2: { fontSize: 24, fontWeight: "700" },
  h3: { fontSize: 18, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  small: { fontSize: 14, fontWeight: "400" },
};

export const Theme = {
  light: {
    background: Colors.background,
    text: Colors.text,
    primary: Colors.primary,
  },
  dark: {
    background: Colors.darkBackground,
    text: Colors.darkText,
    primary: Colors.primary,
  },
};
