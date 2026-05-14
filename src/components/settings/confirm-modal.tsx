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
    cancelLabel = "Cancel",
    onClose,
    onConfirm,
}: ConfirmModalProps) {
    return (
        <AppModal
            // Modal control props
            visible={visible}
            onRequestClose={onClose}

            title={title}

            // Action button props
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
            confirmColor={"#3E1811"}
            confirmTextColor={"#e4a298"}
            onCancel={onClose}
            onConfirm={onConfirm}
        >
            <Text style={styles.message}>{message}</Text>
        </AppModal>
    );
}

const styles = StyleSheet.create({
    message: {
        fontSize: 14,
        lineHeight: 20,
        color: "#D7C1BE",
        textAlign: "center",
    },
});
