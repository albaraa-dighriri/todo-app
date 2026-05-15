import { Pressable, StyleSheet, Text, View } from "react-native";

type ModalActionButtonsProps = {
    cancelLabel?: string;
    confirmLabel: string;
    cancelTextColor?: string;
    confirmTextColor?: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ModalActionButtons({
    confirmLabel,
    cancelLabel = "Cancel",
    confirmTextColor = "#FFFFFF",
    cancelTextColor = "#FFFFFF",
    onConfirm,
    onCancel,
}: ModalActionButtonsProps) {
    return (
        <View style={styles.container}>
            <View style={styles.divider} />

            <Pressable style={styles.button} onPress={onConfirm}>
                <Text style={[styles.buttonText, styles.confirmText, { color: confirmTextColor }]}>
                    {confirmLabel}
                </Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.button} onPress={onCancel}>
                <Text style={[styles.buttonText, { color: cancelTextColor }]}>
                    {cancelLabel}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    button: {
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "400",
    },
    confirmText: {
        fontWeight: "700",
    },
});
