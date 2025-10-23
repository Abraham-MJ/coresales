import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const GRADIENT_COLORS = [
        '#00f5a5',
        '#2addaa',
        '#00b09b',
    ] as const;

    const diagonalLines = [
        { width: 2, height: 200, opacity: 0.3, top: 50, left: 100 },
        { width: 2, height: 150, opacity: 0.35, top: 200, left: 50 },
        { width: 2, height: 300, opacity: 0.25, top: 100, right: 80 },
        { width: 2, height: 180, opacity: 0.32, bottom: 150, left: 200 },
        { width: 2, height: 250, opacity: 0.28, bottom: 100, right: 50 },
    ];

    return (
        <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.5, 1]}
            style={styles.gradient}
        >
            {diagonalLines.map((line, index) => (
                <View
                    key={index}
                    style={[
                        styles.diagonalLine,
                        {
                            width: line.width,
                            height: line.height,
                            backgroundColor: `rgba(255, 255, 255, ${line.opacity})`,
                            ...('top' in line && { top: line.top }),
                            ...('bottom' in line && { bottom: line.bottom }),
                            ...('left' in line && { left: line.left }),
                            ...('right' in line && { right: line.right }),
                        },
                    ]}
                />
            ))}
            {children}
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        position: 'relative',
    },
    diagonalLine: {
        position: 'absolute',
        transform: [{ rotate: '45deg' }],
    },
});