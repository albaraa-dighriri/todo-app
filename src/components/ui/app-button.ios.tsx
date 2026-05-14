import { AppButtonProps } from "@/types/buttons";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { StyleSheet } from "react-native";
import NormalAppButton from "./private/normal-app-button";


export default function AppButton({ style, color, iosGlassEffectStyle, iosIsInteractive, ...props }: AppButtonProps) {
    if (isLiquidGlassAvailable()) {
        return (
            <GlassView
                style={style}
                tintColor={color}
                glassEffectStyle={iosGlassEffectStyle}
                isInteractive={iosIsInteractive}
            >
                {/* 
                absoluteFill makes the pressable fill the entire GlassView.
                Otherwise it shrinks to its content, leaving the edges untouchable and children uncentered 
                */}
                <NormalAppButton style={StyleSheet.absoluteFill} {...props} />
            </GlassView>
        );
    }

    return <NormalAppButton style={style} color={color} {...props} />
}
