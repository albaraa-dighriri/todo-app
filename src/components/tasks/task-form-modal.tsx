import AppModal from "@/components/ui/AppModal/app-modal";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { StyleSheet, Text, TextInput } from "react-native";
import AppCard from "../ui/AppCard/app-card";

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
            <AppCard
                style={[
                    styles.inputContainer,
                    !isLiquidGlassAvailable() && {
                        borderWidth: 1,
                        borderColor: showError ? "#ff4444" : "#484848",
                    }
                ]}
                color={showError && isLiquidGlassAvailable() ? "#3d2222" : "#2d2d2d"}
                iosIsInteractive>
                <TextInput
                    style={styles.input}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder={inputPlaceholder}
                    placeholderTextColor={showError && isLiquidGlassAvailable() ? "#d45e58da" : "#595959"}
                    selectionColor={showError ? "#ff4444" : "#FFFFFF"}
                    autoFocus
                />
            </AppCard>

            {showError && (
                <Text style={styles.errorText}>Cannot be empty</Text>
            )}
        </AppModal>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        borderRadius: 8,
    },

    input: {
        padding: 10,
        color: "#FFFFFF"
    },

    errorText: {
        color: "#ff4444",
        fontSize: 12,
        marginTop: 6,
        fontWeight: "500",
    },
});