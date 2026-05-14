import AppButton from "@/components/ui/AppButton/app-button";
import { FontAwesome6 } from "@expo/vector-icons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Platform, StyleSheet } from "react-native";

const addButtonBottomOffset = Platform.OS === 'android' ? 30 : 100;

type AddTaskButtonProps = {
    onPress: () => void;
};

export default function AddTaskButton({ onPress }: AddTaskButtonProps) {
    return (
        <AppButton
            style={[
                styles.container,
                !isLiquidGlassAvailable() && {
                    borderWidth: 1,
                    borderColor: "#484848",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.4)",
                }
            ]}
            color="#303030"
            iosGlassEffectStyle="clear"
            iosIsInteractive
            onPress={onPress}
        >
            <FontAwesome6 name="plus" size={20} color="white" />
        </AppButton>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: addButtonBottomOffset,
        right: 24,
        height: 56,
        width: 56,
        borderRadius: 24,
    },
});
