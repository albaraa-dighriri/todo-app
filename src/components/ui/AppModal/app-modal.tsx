import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import ModalActionButtons from "../private/Modal/modal-action-buttons";
import ModalShell from "../private/Modal/modal-shell";

type AppModalProps = {
    // Modal control props
    visible: boolean;
    keyboardAware?: boolean;
    onRequestClose: () => void;

    // styling props
    backgroundColor?: string;

    // Content
    title: string;
    children: ReactNode;

    // Action button props
    confirmLabel: string;
    cancelTextColor?: string;
    cancelLabel?: string;
    confirmTextColor?: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function AppModal({
    visible,
    keyboardAware,
    onRequestClose,

    backgroundColor,

    title,
    children,

    onCancel,
    onConfirm,
    cancelLabel,
    confirmLabel,
    cancelTextColor,
    confirmTextColor,
}: AppModalProps) {
    return (
        <ModalShell
            visible={visible}
            backgroundColor={backgroundColor}
            keyboardAware={keyboardAware}
            onRequestClose={onRequestClose}
        >
            {/* Modal title */}
            <Text style={styles.title}>{title}</Text>

            {/* Modal content */}
            <View style={styles.modalContainer}>
                {children}
            </View>

            {/* Modal action buttons */}
            <ModalActionButtons
                cancelLabel={cancelLabel}
                confirmLabel={confirmLabel}
                cancelTextColor={cancelTextColor}
                confirmTextColor={confirmTextColor}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        </ModalShell>
    );
}

const styles = StyleSheet.create({
    title: {
        paddingTop: 16,
        paddingHorizontal: 24,
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },

    modalContainer: {
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: 16,
    },
});
