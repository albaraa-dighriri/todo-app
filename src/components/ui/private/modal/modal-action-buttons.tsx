import { StyleSheet, Text, View } from "react-native";
import AppButton from "../../AppButton/app-button";

type ModalActionButtonsProps = {
    cancelLabel?: string;
    confirmLabel: string;
    cancelColor?: string;
    cancelTextColor?: string;
    confirmColor: string;
    confirmTextColor: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ModalActionButtons({
    cancelLabel = "Cancel",
    confirmLabel,
    cancelColor = "#484848",
    cancelTextColor = "#efefef",
    confirmColor,
    confirmTextColor,
    onCancel,
    onConfirm,
}: ModalActionButtonsProps) {
    return (
        <View style={styles.container}>
            <AppButton
                style={styles.button}
                color={cancelColor}
                iosGlassEffectStyle="clear"
                iosIsInteractive
                onPress={onCancel}
            >
                <Text style={[styles.buttonText, { color: cancelTextColor }]}>
                    {cancelLabel}
                </Text>
            </AppButton>

            <AppButton
                style={styles.button}
                color={confirmColor}
                iosGlassEffectStyle="clear"
                iosIsInteractive
                onPress={onConfirm}
            >
                <Text style={[styles.buttonText, { color: confirmTextColor }]}>
                    {confirmLabel}
                </Text>
            </AppButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
    },
    button: {
        height: 35,
        width: 90,
        borderRadius: 8,
    },
    buttonText: {
        fontWeight: "600",
        fontSize: 14,
    },
});
