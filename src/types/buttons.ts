import { GlassEffectStyleConfig, GlassStyle } from "expo-glass-effect";
import { ViewStyle } from "react-native";

export type AppButtonProps = {
  style?: ViewStyle;
  color?: string;
  iosGlassEffectStyle?: GlassStyle | GlassEffectStyleConfig;
  iosIsInteractive?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
};
