import AddTaskButton from "@/components/tasks/add-task-button";
import TaskCard from "@/components/tasks/task-card";
import TaskFormModal from "@/components/tasks/task-form-modal";
import { useSettingsStore } from "@/store/use-settings-store";
import { useTaskStore } from "@/store/use-task-store";
import { TaskItem } from "@/types/task";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Sortable from "react-native-sortables";

type TaskFormModalState = {
  visible: boolean;
  mode: "add" | "edit";
  title: string;
  editingTaskId: string | null;
  inputValue: string;
  placeholder: string;
  showError?: boolean;
};

export default function TasksScreen() {
  const {
    showTaskNumbers,
    tasksGridColumns
  } = useSettingsStore();
  const {
    tasks,
    addTask,
    toggleTask,
    updateTask,
    reorderTasks,
    removeTask
  } = useTaskStore();

  const [taskFormModalState, setTaskFormModalState] = useState<TaskFormModalState | null>(null);

  const handleCloseTaskModal = () => {
    setTaskFormModalState((currentState) => {
      if (currentState === null) {
        return null;
      }

      return {
        ...currentState,
        visible: false,
      };
    });
  }

  const handleSubmitTask = () => {
    if (!taskFormModalState) return;

    if (taskFormModalState?.mode === "add") {
      taskFormModalState.inputValue && addTask(taskFormModalState.inputValue);
    } else if (taskFormModalState?.mode === "edit") {
      taskFormModalState.editingTaskId && updateTask(taskFormModalState.editingTaskId, taskFormModalState.inputValue);
    }
  };

  const handleToggleCompleted = (id: string) => {
    toggleTask(id);
  };

  const handlePressEdit = (task: TaskItem) => {
    setTaskFormModalState({
      visible: true,
      mode: "edit",
      title: "Edit Task",
      editingTaskId: task.id,
      inputValue: task.title,
      placeholder: task.title,
    });
  }

  const handleDelete = (id: string) => {
    removeTask(id);
  };

  const renderItem = useCallback(({
    canShowTaskNumber,
    index,
    item
  }: {
    canShowTaskNumber: boolean,
    index: number,
    item: TaskItem
  }) => (
    <TaskCard
      taskNumber={canShowTaskNumber ? index + 1 : undefined}
      task={item}
      onToggleCompleted={() => handleToggleCompleted(item.id)}
      onEdit={() => handlePressEdit(item)}
      onDelete={() => handleDelete(item.id)}
    />
  ), []);

  return (
    <>
      {tasks.length === 0 ? (
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>There is no tasks</Text>
          <Text style={styles.noTasksText}>Add one to get started 🚀</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.tasksContainer}
          contentContainerStyle={styles.tasksContentContainer}
          contentInsetAdjustmentBehavior="automatic"
        >
          <Sortable.Grid
            columns={parseInt(tasksGridColumns) || 1}
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ index, item }) => {
              const canShowTaskNumber = showTaskNumbers === 'numbered';
              return renderItem({ canShowTaskNumber, index, item });
            }}
            onDragEnd={({ data }) => reorderTasks(data)}
            rowGap={16}
            columnGap={16}
          />
        </ScrollView>
      )}

      <AddTaskButton
        onPress={() =>
          setTaskFormModalState({
            visible: true,
            mode: "add",
            title: "New Task",
            editingTaskId: null,
            inputValue: "",
            placeholder: "Add a new task",
          })
        }
      />

      <TaskFormModal
        visible={taskFormModalState?.visible ?? false}
        mode={taskFormModalState?.mode ?? "add"}
        title={taskFormModalState?.title ?? ""}
        inputValue={taskFormModalState?.inputValue ?? ""}
        inputPlaceholder={taskFormModalState?.placeholder ?? ""}
        showError={taskFormModalState?.showError ?? false}
        onChange={(inputValue) => setTaskFormModalState((currentState) => currentState ? { ...currentState, inputValue } : null)}
        onChangeShowError={(showError) => setTaskFormModalState((currentState) => currentState ? { ...currentState, showError } : null)}
        onClose={handleCloseTaskModal}
        onSubmit={() => {
          handleSubmitTask()
          handleCloseTaskModal();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  noTasksContainer: {
    flex: 1,
    backgroundColor: "#212121",
    paddingHorizontal: 16,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  noTasksText: {
    color: "#757575",
  },

  tasksContainer: {
    height: '100%',
    paddingHorizontal: 16,
    backgroundColor: "#212121",
  },
  tasksContentContainer: {
    paddingTop: 16,
    paddingBottom: 120,
  },
});
