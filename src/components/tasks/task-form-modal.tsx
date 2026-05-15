import AppModal from "@/components/ui/AppModal/app-modal";
import { StyleSheet, Text, TextInput } from "react-native";

type TaskFormModalProps = {
    // Modal control props
    visible: boolean;
    mode: "add" | "edit";
    inputValue: string;
    showError: boolean;
    onChange: (text: string) => void;
    onChangeShowError: (showError: boolean) => void;

    // Content
    title: string;
    inputPlaceholder: string;

    // Action button props
    onClose: () => void;
    onSubmit: () => void;
};

export default function TaskFormModal({
    visible,
    mode,
    inputValue,
    showError,
    onChange,
    onChangeShowError,

    title,
    inputPlaceholder,

    onClose,
    onSubmit,
}: TaskFormModalProps) {

    const handleSubmit = () => {
        if (inputValue.trim() === "") {
            onChangeShowError(true);
        } else {
            // onChangeShowError(false); --- IGNORE ---
            onSubmit();
        }
    };

    const handleInputChange = (text: string) => {
        onChange(text);

        if (showError && text.trim() !== "") {
            onChangeShowError(false);
        }
    };

    return (
        <AppModal
            // Modal control props
            visible={visible}
            keyboardAware
            onRequestClose={onClose}

            title={title}

            // Action button props
            confirmLabel={mode === "edit" ? "Update" : "Save"}
            confirmTextColor={mode === "edit" ? "#F5C518" : "#34C759"}
            onConfirm={handleSubmit}
            onCancel={onClose}
        >
            <TextInput
                style={[
                    styles.input,
                    showError && styles.inputError,
                ]}
                value={inputValue}
                onChangeText={handleInputChange}
                placeholder={inputPlaceholder}
                placeholderTextColor={"#595959"}
                autoFocus
            />

            {showError && (
                <Text style={styles.errorText}>Cannot be empty</Text>
            )}
        </AppModal>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#2d2d2d',
        borderWidth: 1,
        borderColor: "#484848",
        padding: 10,
        borderRadius: 8,
        color: "white",
    },
    inputError: {
        borderColor: "#ff4444",
    },

    errorText: {
        color: "#ff4444",
        fontSize: 12,
        marginTop: 6,
        fontWeight: "500",
    },
});