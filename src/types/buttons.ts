import { GlassEffectStyleConfig, GlassStyle } from "expo-glass-effect";
import { StyleProp, ViewStyle } from "react-native";

export type AppButtonProps = {
  style?: StyleProp<ViewStyle>;
  color?: string;
  iosGlassEffectStyle?: GlassStyle | GlassEffectStyleConfig;
  iosIsInteractive?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
};
