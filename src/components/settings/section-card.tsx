import AppCard from '@/components/ui/AppCard/app-card'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import React, { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type SectionCardProps = {
    type?: 'default' | 'compact'

    backgroundColor?: string
    borderColor?: string

    title: string
    titleColor?: string,

    description: string,
    descriptionColor?: string,

    children: ReactNode
}
export default function SectionCard({
    type = 'default',

    backgroundColor = "#262626",
    borderColor = "#484848",

    title,
    titleColor = "#ffffff",

    description,
    descriptionColor = "#9e9e9e",

    children
}: SectionCardProps) {
    return (
        <AppCard
            style={[
                styles.container,
                !isLiquidGlassAvailable() && {
                    borderWidth: 1,
                    borderColor,
                }
            ]}
            color={backgroundColor}
            iosGlassEffectStyle={type === 'compact' ? 'regular' : 'clear'}
            iosIsInteractive
        >
            <View style={styles.textContainer}>
                <Text style={[{ color: titleColor }, type === 'default' ? styles.title : styles.titleCompact]}>{title}</Text>
                <Text style={[{ color: descriptionColor }, type === 'default' ? styles.description : styles.descriptionCompact]}>{description}</Text>
            </View>
            {children}
        </AppCard>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },

    textContainer: {
        gap: 12
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
    },
    titleCompact: {
        fontSize: 16,
        fontWeight: "600",
    },

    description: {
        fontSize: 16,
    },
    descriptionCompact: {
        fontSize: 14,
    },
})