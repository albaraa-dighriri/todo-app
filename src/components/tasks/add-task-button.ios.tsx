import { FontAwesome6 } from "@expo/vector-icons";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Pressable, StyleSheet } from "react-native";
import NormalAddButton from "./normal-add-button";

const BUTTON_BOTTOM_OFFSET = 100;

type AddTaskButtonProps = {
  onPress: () => void;
};

export default function AddTaskButton({ onPress }: AddTaskButtonProps) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView style={styles.glassButton} glassEffectStyle="clear" isInteractive>
        <Pressable style={styles.glassPressable} onPress={onPress}>
          <FontAwesome6 name="plus" size={20} color="white" />
        </Pressable>
      </GlassView>
    );
  }

  return <NormalAddButton bottom={BUTTON_BOTTOM_OFFSET} onPress={onPress} />;
}

const styles = StyleSheet.create({
  glassButton: {
    position: "absolute",
    bottom: BUTTON_BOTTOM_OFFSET,
    right: 24,
    height: 56,
    width: 56,
    borderRadius: 24,
  },
  glassPressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
