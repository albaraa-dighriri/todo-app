import { AppButtonProps } from "@/types/buttons";
import NormalAppButton from "./private/normal-app-button";

export default function AppButton({ style, color, iosGlassEffectStyle, iosIsInteractive, ...props }: AppButtonProps) {
    return (
        <NormalAppButton style={style} color={color} {...props} />
    );
}
