import { AppPickerProps } from '@/types/picker';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AppPicker({ options, selectedValue, onValueChange }: AppPickerProps) {
    return (
        <View style={styles.container}>
            {options.map(({ value, label }) => (
                <Pressable
                    key={value}
                    style={[styles.option, selectedValue === value && styles.optionSelected]}
                    onPress={() => onValueChange(value)}>
                    <Text style={[styles.label, selectedValue === value && styles.labelSelected]}>
                        {label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 2,
        gap: 2,
    },
    option: {
        flex: 1,
        paddingVertical: 7,
        borderRadius: 6,
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: '#505050',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#9e9e9e',
    },
    labelSelected: {
        color: 'white',
    },
});
