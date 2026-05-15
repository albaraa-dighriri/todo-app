import { AppPickerProps } from '@/types/picker';
import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

export default function AppPicker({ options, selectedValue, onValueChange }: AppPickerProps) {
    return (
        <Host matchContents>
            <Picker
                modifiers={[pickerStyle('segmented')]}
                selection={selectedValue}
                onSelectionChange={onValueChange}>
                {options.map(({ value, label }) => (
                    <Text key={value} modifiers={[tag(value)]}>
                        {label}
                    </Text>
                ))}
            </Picker>
        </Host>
    );
}
