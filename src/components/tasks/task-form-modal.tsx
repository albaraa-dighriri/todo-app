import AppButton from "@/components/ui/app-button";
import ModalShell from "@/components/ui/modal-shell";
import { StyleSheet, Text, TextInput, View } from "react-native";

type TaskFormModalProps = {
    visible: boolean;
    title: string;
    inputValue: string;
    inputPlaceholder: string;
    showError: boolean;
    onChange: (text: string) => void;
    onChangeShowError: (showError: boolean) => void;
    onClose: () => void;
    onSubmit: () => void;
};

export default function TaskFormModal({
    visible,
    title,
    inputValue,
    inputPlaceholder,
    showError,
    onChange,
    onChangeShowError,
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
        <ModalShell
            visible={visible}
            keyboardAware
            onRequestClose={onClose}
        >
            <Text style={styles.title}>{title}</Text>
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

            <View style={styles.actionButtonsContainer}>
                <AppButton
                    style={styles.actionButton}
                    color="#3E1811"
                    iosGlassEffectStyle="clear"
                    iosIsInteractive
                    onPress={onClose}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </AppButton>

                <AppButton
                    style={styles.actionButton}
                    color="#133e11"
                    iosGlassEffectStyle="clear"
                    iosIsInteractive
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Save</Text>
                </AppButton>
            </View>
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

    input: {
        marginTop: 24,
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

    actionButtonsContainer: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
    },

    actionButton: {
        height: 35,
        width: 70,
        borderRadius: 8,
    },

    cancelButtonText: {
        color: '#e4a298',
    },

    submitButtonText: {
        color: '#a1e7a1',
    },
});