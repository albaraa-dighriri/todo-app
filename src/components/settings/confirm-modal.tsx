import AppModal from "@/components/ui/AppModal/app-modal";
import { StyleSheet, Text } from "react-native";

type ConfirmModalProps = {
    // Modal control props
    visible: boolean;

    // Content
    title: string;
    message: string;

    // Action button props
    confirmLabel: string;
    cancelLabel?: string;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmModal({
    visible,

    title,
    message,

    confirmLabel,
    cancelLabel,
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    return (
        <AppModal
            // Modal control props
            visible={visible}
            onRequestClose={onClose}

            title={title}

            // Action button props
            confirmLabel={confirmLabel}
            confirmTextColor="#FF3B30"
            cancelLabel={cancelLabel}
            onConfirm={onConfirm}
            onCancel={onClose}
        >
            <Text style={styles.message}>{message}</Text>
        </AppModal>
    );
}

const styles = StyleSheet.create({
    message: {
        fontSize: 14,
        lineHeight: 20,
        color: "#FFFFFF",
        textAlign: "center",
    },
});
