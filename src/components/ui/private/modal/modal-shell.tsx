import { ReactNode } from 'react';
import { Modal, Platform, Pressable, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const keyboardVerticalOffset = Platform.OS === 'android' ? 48 : 24;

type ModalShellProps = {
    visible: boolean;
    keyboardAware?: boolean;
    onRequestClose: () => void;
    children: ReactNode;
};

export default function ModalShell({ visible, keyboardAware, onRequestClose, children }: ModalShellProps) {
    const ModalCard = (
        <Pressable
            style={styles.modal}
            onPress={(e) => e.stopPropagation()}
        >
            {children}
        </Pressable>
    )

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onRequestClose}
        >
            <Pressable
                style={styles.overlay}
                onPress={onRequestClose}
            >
                {keyboardAware ? (
                    <KeyboardAvoidingView
                        style={styles.avoidingViewContainer}
                        behavior={'padding'}
                        keyboardVerticalOffset={keyboardVerticalOffset}
                    >
                        {ModalCard}
                    </KeyboardAvoidingView>
                ) : (
                    ModalCard
                )}
            </Pressable>
        </Modal >
    );
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    avoidingViewContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        width: "80%",
        backgroundColor: "#212121",
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 12,
    },
});