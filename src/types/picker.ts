export type AppPickerOption = {
    value: string;
    label: string;
};

export type AppPickerProps = {
    options: AppPickerOption[];
    selectedValue: string;
    onValueChange: (value: string) => void;
};
