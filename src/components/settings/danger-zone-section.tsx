import AppButton from '@/components/ui/AppButton/app-button';
import { useTaskStore } from '@/store/use-task-store';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ConfirmModal from './confirm-modal';
import SectionCard from './section-card';

type ConfirmAction = "clearCompleted" | "deleteAll";

type ConfirmModalState = {
    visible: boolean;
    action: ConfirmAction;
    title: string;
    message: string;
    confirmLabel: string;
};

function DangerZoneButton({
    title,
    hintText,
    disabled,
    onPress
}: {
    title: string,
    hintText: string,
    disabled: boolean
    onPress: () => void
}) {
    return (
        <AppButton
            style={[
                styles.button,
                disabled && styles.buttonDisabled,
                !isLiquidGlassAvailable() && {
                    borderWidth: 1,
                    borderColor: "#7A3B3B",
                },
            ]}
            disabled={disabled}
            color="#442626"
            iosIsInteractive={!disabled} // disable glass press effect when button is disabled
            onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
            <Text style={styles.buttonHintText}>{hintText}</Text>
        </AppButton>
    )
}

export default function DangerZoneSection() {
    const { tasks, clearCompletedTasks, deleteAllTasks } = useTaskStore();
    const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState | null>(null);

    const completedTasksCount = tasks.filter((task) => task.completed).length;
    const totalTasksCount = tasks.length;

    const handleCloseConfirmModal = () => {
        setConfirmModalState((currentState) => {
            if (currentState === null) {
                return null;
            }

            return {
                ...currentState,
                visible: false,
            };
        });
    };

    const handleConfirmAction = () => {
        if (confirmModalState?.action === "clearCompleted") {
            clearCompletedTasks();
        }

        if (confirmModalState?.action === "deleteAll") {
            deleteAllTasks();
        }
    };

    return (
        <>
            <SectionCard
                backgroundColor="#2B1F1F"
                borderColor="#5C2E2E"

                title='Danger Zone'
                titleColor='#fff1f0'

                description='These actions remove tasks and cannot be undone.'
                descriptionColor='#D7C1BE'
            >
                <View style={styles.container}>
                    <DangerZoneButton
                        title='Clear Completed Tasks'
                        hintText={completedTasksCount === 0
                            ? "No completed tasks to remove"
                            : `${completedTasksCount} completed task${completedTasksCount === 1 ? "" : "s"} ready to clear`}
                        disabled={completedTasksCount === 0}
                        onPress={() =>
                            setConfirmModalState({
                                visible: true,
                                action: "clearCompleted",
                                title: "Clear Completed Tasks?",
                                message: `This will remove ${completedTasksCount} completed task${completedTasksCount === 1 ? "" : "s"}.`,
                                confirmLabel: "Clear",
                            })}
                    />
                    <DangerZoneButton
                        title='Delete All Tasks'
                        hintText={totalTasksCount === 0
                            ? "No tasks to delete"
                            : `${totalTasksCount} task${totalTasksCount === 1 ? "" : "s"} will be removed`}
                        disabled={totalTasksCount === 0}
                        onPress={() =>
                            setConfirmModalState({
                                visible: true,
                                action: "deleteAll",
                                title: "Delete All Tasks?",
                                message: `This will permanently remove ${totalTasksCount} task${totalTasksCount === 1 ? "" : "s"}.`,
                                confirmLabel: "Delete All",
                            })
                        }
                    />
                </View>
            </SectionCard >

            <ConfirmModal
                visible={confirmModalState?.visible ?? false}
                title={confirmModalState?.title ?? ""}
                message={confirmModalState?.message ?? ""}
                confirmLabel={confirmModalState?.confirmLabel ?? ""}
                onClose={handleCloseConfirmModal}
                onConfirm={() => {
                    handleConfirmAction();
                    handleCloseConfirmModal();
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 12
    },
    button: {
        height: 64,
        width: '100%',
        borderRadius: 16,
        gap: 4,
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonText: {
        color: "#ffe7e3",
        fontSize: 16,
        fontWeight: "700",
    },
    buttonHintText: {
        color: "#D7C1BE",
        fontSize: 13,
    },
})