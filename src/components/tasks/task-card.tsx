import AppButton from '@/components/ui/AppButton/app-button';
import AppCard from '@/components/ui/AppCard/app-card';
import type { TaskItem } from '@/types/task';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { StyleSheet, Text, View } from 'react-native';

type TaskItemProps = {
    taskNumber?: number;
    task: TaskItem;
    onToggleCompleted: () => void;
    onEdit: () => void;
    onDelete: () => void;
}
export default function TaskCard({ taskNumber, task, onToggleCompleted, onEdit, onDelete }: TaskItemProps) {

    return (
        <AppCard
            style={[
                styles.container,
                !isLiquidGlassAvailable() && {
                    borderWidth: 1,
                    borderColor: "#484848",
                }
            ]}
            color="#2d2d2d"
            iosGlassEffectStyle="clear"
            iosIsInteractive
        >
            <AppButton
                style={[styles.checkbox,
                !isLiquidGlassAvailable() && {
                    borderWidth: 1,
                    borderColor: task.completed ? 'white' : '#484848',
                }
                ]}
                color={task.completed ? "white" : "#212121"}
                iosIsInteractive
                onPress={() => onToggleCompleted()}
            >
                {task.completed && <FontAwesome5 name="check" size={12} color="black" />}
            </AppButton>

            <View style={styles.taskContent}>
                <Text
                    style={[styles.title, task.completed && styles.titleCompleted]}
                    android_hyphenationFrequency="full"
                    textBreakStrategy="balanced"
                >
                    {taskNumber !== undefined && `${taskNumber}. `}{task.title}
                </Text>

                <View style={styles.actionsContainer}>
                    <AppButton
                        style={styles.actionButton}
                        color="#3e3311"
                        iosGlassEffectStyle="clear"
                        iosIsInteractive
                        onPress={onEdit}
                    >
                        <FontAwesome6 name="edit" size={16} color="#d4c158" />
                    </AppButton>

                    <AppButton
                        style={styles.actionButton}
                        color={"#3E1811"}
                        iosGlassEffectStyle="clear"
                        iosIsInteractive
                        onPress={onDelete}
                    >
                        <FontAwesome6 name="trash" size={16} color="#d45f58" />
                    </AppButton>
                </View>
            </View>
        </AppCard>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        minWidth: 0,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 12,
        gap: 16,
    },

    taskContent: {
        flex: 1,
        minWidth: 0,
        gap: 24,
    },

    checkbox: {
        height: 24,
        width: 24,
        borderRadius: 10,
    },

    title: {
        flexShrink: 1,
        minWidth: 0,
        color: "white",
        fontSize: 18,
        fontWeight: "500",
        lineHeight: 24,
    },
    titleCompleted: {
        color: "#595959",
        textDecorationLine: "line-through",
    },

    actionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    actionButton: {
        height: 42,
        width: 42,
        borderRadius: 12,
    },
})
