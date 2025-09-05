import { Platform } from "react-native";

export const theme = {
  colors: {
    background: "#F5F7FA",
    card: "#FFFFFF",
    primary: "#2F3136",
    secondary: "#585B63", // primaryよりちょっと薄め
    border: "#C5CECD",
    placeholder: "#A0A0A0",
    icon: "#888",
    selection: "#007AFF",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 36,
  },
  radius: {
    sm: 8,
    md: 12,
  },
  shadows: {
    iosOnlyLight: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
    }),
    light: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
    medium: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    strong: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 7,
      },
    }),
  },
};
