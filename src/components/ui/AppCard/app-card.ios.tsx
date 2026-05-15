import { AppCardProps } from "@/types/cards";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { View } from "react-native";

export default function AppCard({ style, color, iosGlassEffectStyle, iosIsInteractive, children }: AppCardProps) {
    if (isLiquidGlassAvailable()) {
        return (
            <GlassView
                style={style}
                tintColor={color}
                glassEffectStyle={iosGlassEffectStyle ?? "regular"}
                isInteractive={iosIsInteractive}
            >
                {children}
            </GlassView>
        );
    }

    return (
        <View style={[style, { backgroundColor: color }]}>
            {children}
        </View>
    );
}
