import { AppCardProps } from "@/types/cards";
import { View } from "react-native";

export default function AppCard({ style, color, iosGlassEffectStyle, iosIsInteractive, children }: AppCardProps) {
    return (
        <View style={[style, { backgroundColor: color }]}>
            {children}
        </View>
    );
}
