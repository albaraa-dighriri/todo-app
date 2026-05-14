import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import ModalActionButtons from "../private/Modal/modal-action-buttons";
import ModalShell from "../private/Modal/modal-shell";

type AppModalProps = {
    // Modal control props
    visible: boolean;
    keyboardAware?: boolean;
    onRequestClose: () => void;

    // Content
    title: string;
    children: ReactNode;

    // Action button props
    cancelLabel?: string;
    confirmLabel: string;
    cancelColor?: string;
    cancelTextColor?: string;
    confirmColor: string;
    confirmTextColor: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function AppModal({
    visible,
    keyboardAware,
    onRequestClose,

    title,
    children,

    onCancel,
    onConfirm,
    cancelLabel,
    confirmLabel,
    cancelColor,
    cancelTextColor,
    confirmColor,
    confirmTextColor,
}: AppModalProps) {
    return (
        <ModalShell
            visible={visible}
            keyboardAware={keyboardAware}
            onRequestClose={onRequestClose}
        >
            {/* Modal title */}
            <Text style={styles.title}>{title}</Text>

            <View style={styles.titleSpacing} />

            {/* Modal content */}
            {children}

            <View style={styles.actionsSpacing} />

            {/* Modal action buttons */}
            <ModalActionButtons
                cancelLabel={cancelLabel}
                confirmLabel={confirmLabel}
                cancelColor={cancelColor}
                cancelTextColor={cancelTextColor}
                confirmColor={confirmColor}
                confirmTextColor={confirmTextColor}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        </ModalShell>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    titleSpacing: {
        height: 16,
    },
    actionsSpacing: {
        height: 24,
    },
});