import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

type NormalAppButtonProps = PressableProps & {
    style?: StyleProp<ViewStyle>;
    color?: string;
}

export default function NormalAppButton({ style, color, ...props }: NormalAppButtonProps) {
    return (
        <Pressable
            style={[{ justifyContent: 'center', alignItems: 'center' }, style, { backgroundColor: color }]}
            {...props}
        />
    );
}