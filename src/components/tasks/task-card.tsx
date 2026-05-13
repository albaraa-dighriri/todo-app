import type { TaskItem } from '@/types/task';
import { addSoftHyphensToLongWords } from '@/utils/text';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

function formatTaskTitleForDisplay(title: string) {
    // iOS only - React Native does not give us a prop to enable hyphenation on iOS, so we insert break points manually.
    if (Platform.OS === 'ios') {
        return addSoftHyphensToLongWords(title);
    }
    
    // For Android, we can return the title as-is and let the platform handle it.
    // Android handles hyphenation natively via android_hyphenationFrequency="full" on the Text component.
    return title;
}

type TaskItemProps = {
    taskNumber?: number;
    task: TaskItem;
    onToggleCompleted: () => void;
    onEdit: () => void;
    onDelete: () => void;
}
export default function TaskCard({ taskNumber, task, onToggleCompleted, onEdit, onDelete }: TaskItemProps) {
    const displayTitle = formatTaskTitleForDisplay(task.title);

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
                onPress={() => onToggleCompleted()}
            >
                {task.completed && <FontAwesome5 name="check" size={12} color="black" />}
            </Pressable>

            <View style={styles.taskContent}>
                <Text
                    style={[styles.title, task.completed && styles.titleCompleted]}
                    android_hyphenationFrequency="full"
                    textBreakStrategy="balanced"
                >
                    {taskNumber !== undefined && `${taskNumber}. `}{displayTitle}
                </Text>

                <View style={styles.actionsContainer}>
                    <Pressable
                        style={[styles.actionButton, styles.editButton]}
                        onPress={onEdit}
                    >
                        <FontAwesome6 name="edit" size={16} color="#d4c158" />
                    </Pressable>

                    <Pressable
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={onDelete}
                    >
                        <FontAwesome6 name="trash" size={16} color="#d45f58" />
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        minWidth: 0,
        backgroundColor: '#2d2d2d',
        borderWidth: 1,
        borderColor: "#484848",
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
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#484848',
        borderRadius: 10,
        backgroundColor: "#212121",
    },
    checkboxCompleted: {
        backgroundColor: "white",
        borderColor: "white",
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
        alignItems: "center",
        justifyContent: "center",
    },

    editButton: {
        backgroundColor: "#3e3311",
    },

    deleteButton: {
        backgroundColor: "#3E1811",
    },
})
