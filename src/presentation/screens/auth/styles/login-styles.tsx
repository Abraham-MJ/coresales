import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export const login_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C352E',
        paddingHorizontal: width * 0.05,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: height * 0.1,
        marginBottom: height * 0.05,
    },
    logo: {
        width: 133,
        height: 130,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingHorizontal: width * 0.04,
        paddingVertical: width * 0.06,
        marginHorizontal: width * 0.01,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: '600' as '600',
        color: '#232323',
        textAlign: 'center',
        marginBottom: height * 0.04,
    },
    form: {
        gap: 12,
    },
    forgotPassword: {
        fontSize: width * 0.035,
        color: '#0C352E',
        textAlign: 'center',
        fontWeight: 600
    },
    button: {
        backgroundColor: '#0C352E',
        borderRadius: 12,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width * 0.04,
        fontWeight: '600' as '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.05,
    },
    footerText: {
        fontSize: width * 0.035,
        color: '#FFFFFF',
    },
    registerLink: {
        fontSize: width * 0.035,
        color: '#0FE58B',
        fontWeight: '600' as '600',
    },
});