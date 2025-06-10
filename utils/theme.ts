export const theme = {
  colors: {
    background: "#F5F7FA", // アプリ全体の背景色
    card: "#FFFFFF", // カードやモーダルの背景色
    primary: "#6C63FF", // ボタンのグラデーションやアクセント
    text: "#333333", // メインテキスト
    border: "#E0E0E0", // 入力枠や区切り線
    placeholder: "#A0A0A0", // TextInput のプレースホルダー
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  radius: {
    sm: 8,
    md: 12,
  },
  shadows: {
    light: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    strong: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 }, // 4 → 6 に増加
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 7,
    },
  },
};
