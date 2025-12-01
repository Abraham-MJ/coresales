import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const register_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C352E',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: width * 0.06,
        marginHorizontal: width * 0.01,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: '600' as '600',
        color: '#232323',
        textAlign: 'center',
        marginBottom: height * 0.025,
    },
    form: {
        gap: 8,
    },
    phoneRow: {
        flexDirection: 'row',
        gap: 8,
    },
    phoneCodeInput: {
        flex: 0.3,
    },
    phoneNumberInput: {
        flex: 0.7,
    },
    docRow: {
        flexDirection: 'row',
        gap: 8,
    },
    docTypeInput: {
        flex: 0.25,
    },
    docNumberInput: {
        flex: 0.75,
    },
    inputWrapper: {
        marginBottom: 4,
    },
    label: {
        fontSize: width * 0.035,
        color: '#61646B',
        marginBottom: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D7D9CF',
        borderRadius: 12,
        paddingHorizontal: width * 0.04,
        height: 50,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        fontSize: width * 0.04,
        color: '#232323',
    },
    icon: {
        marginLeft: 8,
    },
    errorContainer: {
        minHeight: 18,
        paddingTop: 2,
    },
    errorText: {
        fontSize: width * 0.03,
        color: '#FF3B30',
    },
    button: {
        backgroundColor: '#0C352E',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.015,
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
        marginTop: 20,
        marginBottom: 20,
    },
    footerText: {
        fontSize: width * 0.035,
        color: '#D7D9CF',
    },
    loginLink: {
        fontSize: width * 0.035,
        color: '#0FE58B',
        fontWeight: '600' as '600',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D7D9CF',
        borderRadius: 12,
        height: 50,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    picker: {
        width: 80,
        height: 50,
    },
    phoneInput: {
        flex: 1,
        fontSize: width * 0.04,
        color: '#232323',
        paddingHorizontal: width * 0.04,
    },
    // Success screen styles
    successContainer: {
        alignItems: 'center',
        paddingVertical: height * 0.04,
    },
    successIcon: {
        width: width * 0.3,
        height: width * 0.3,
        marginBottom: height * 0.03,
    },
    successTitle: {
        fontSize: width * 0.055,
        fontWeight: '600' as '600',
        color: '#232323',
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    successMessage: {
        fontSize: width * 0.04,
        color: '#61646B',
        textAlign: 'center',
        lineHeight: width * 0.06,
        paddingHorizontal: width * 0.05,
    },
});
