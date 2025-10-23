import React from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps extends ViewProps {
    children: React.ReactNode;
    scrollable?: boolean;
    safeArea?: boolean;
    edges?: ('top' | 'bottom' | 'left' | 'right')[];
    backgroundColor?: string;
    padding?: number;
}

export function ScreenContainer({
    children,
    scrollable = false,
    safeArea = true,
    edges = ['top'],
    backgroundColor,
    padding = 0,
    style,
    ...props
}: ScreenContainerProps) {
    const insets = useSafeAreaInsets();

    const safeStyle = safeArea ? {
        paddingTop: edges.includes('top') ? insets.top : 0,
        paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
        paddingLeft: edges.includes('left') ? insets.left : 0,
        paddingRight: edges.includes('right') ? insets.right : 0,
    } : {};

    const containerStyle = [
        styles.container,
        safeStyle,
        { backgroundColor, padding },
        style
    ];

    if (scrollable) {
        return (
            <ScrollView
                style={containerStyle}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                {...props}
            >
                {children}
            </ScrollView>
        );
    }

    return (
        <View style={containerStyle} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});