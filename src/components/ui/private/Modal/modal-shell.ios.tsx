import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const keyboardVerticalOffset = 24;

type ModalShellProps = {
    visible: boolean;
    backgroundColor?: string;
    keyboardAware?: boolean;
    onRequestClose: () => void;
    children: React.ReactNode;
};

export default function ModalShell({ visible, backgroundColor, keyboardAware, onRequestClose, children }: ModalShellProps) {
    const ModalCard = isLiquidGlassAvailable() ? (
        <GlassView
            style={styles.glassModal}
            tintColor={backgroundColor}
            glassEffectStyle="clear"
            isInteractive>
            <Pressable
                style={styles.glassModalContent}
                onPress={(e) => e.stopPropagation()}
            >
                {children}
            </Pressable>
        </GlassView>
    ) : (
        <Pressable
            style={[styles.modal, { backgroundColor }]}
            onPress={(e) => e.stopPropagation()}
        >
            {children}
        </Pressable>
    );

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
        </Modal>
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

    // Only for liquid glass devices
    glassModal: {
        width: "80%",
        borderRadius: 12,
    },
    glassModalContent: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    // --

    modal: {
        width: "80%",
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 12,
    },
});
