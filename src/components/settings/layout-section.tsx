import { useSettingsStore } from '@/store/use-settings-store';
import { TaskNumbering, TasksGridColumns } from '@/types/settings';
import AppPicker from '../ui/AppPicker/app-picker';
import SectionCard from './section-card';

const numberingOptions: { value: TaskNumbering; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'numbered', label: 'Numbered' },
];

const columnsOptions: { value: TasksGridColumns; label: string }[] = [
    { value: '1', label: '1 Column' },
    { value: '2', label: '2 Columns' },
];

export default function LayoutSection() {
    const {
        showTaskNumbers,
        setShowTaskNumbers,
        tasksGridColumns,
        setTasksGridColumns
    } = useSettingsStore();

    return (
        <SectionCard
            title="Layout"
            description="Choose how tasks are displayed.">
            <>
                <SectionCard
                    type="compact"
                    title="Numbering"
                    description="Show a number next to each task to track their order."
                    backgroundColor="#303030">
                    <AppPicker
                        options={numberingOptions}
                        selectedValue={showTaskNumbers}
                        onValueChange={value => setShowTaskNumbers(value as TaskNumbering)}
                    />
                </SectionCard>

                <SectionCard
                    type="compact"
                    title="Columns"
                    description="Choose how many columns tasks are displayed in."
                    backgroundColor="#303030">
                    <AppPicker
                        options={columnsOptions}
                        selectedValue={tasksGridColumns}
                        onValueChange={value => setTasksGridColumns(value as TasksGridColumns)}
                    />
                </SectionCard>
            </>
        </SectionCard>
    );
}
