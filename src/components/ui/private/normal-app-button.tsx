import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

type NormalAppButtonProps = PressableProps & {
    style?: StyleProp<ViewStyle>;
    color?: string;
    disabled?: boolean;
}

export default function NormalAppButton({ style, color, disabled, ...props }: NormalAppButtonProps) {
    return (
        <Pressable
            style={[{ justifyContent: 'center', alignItems: 'center' }, style, { backgroundColor: color }]}
            disabled={disabled}
            {...props}
        />
    );
}