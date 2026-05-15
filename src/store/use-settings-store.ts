import { zustandStorage } from "@/storage";
import { TaskNumbering, TasksGridColumns } from "@/types/settings";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SettingsStore = {
    showTaskNumbers: TaskNumbering;
    tasksGridColumns: TasksGridColumns;

    setTasksGridColumns: (columns: TasksGridColumns) => void;
    setShowTaskNumbers: (taskNumbering: TaskNumbering) => void;
}

export const useSettingsStore = create<SettingsStore>()(persist((set) => ({
    showTaskNumbers: 'none',
    tasksGridColumns: '1',

    setShowTaskNumbers: (taskNumbering) => set({ showTaskNumbers: taskNumbering }),
    setTasksGridColumns: (columns) => set({ tasksGridColumns: columns }),
}), {
    name: 'settings-storage',
    storage: createJSONStorage(() => zustandStorage),
}));
