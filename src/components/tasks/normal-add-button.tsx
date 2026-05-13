import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

type NormalAddButtonProps = {
  bottom: number;
  onPress: () => void;
};

export default function NormalAddButton({ bottom, onPress }: NormalAddButtonProps) {
  return (
    <Pressable style={[styles.addButton, { bottom }]} onPress={onPress}>
      <FontAwesome6 name="plus" size={20} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    right: 24,
    height: 56,
    width: 56,
    backgroundColor: "#303030",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#484848",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.4)",
  },
});
