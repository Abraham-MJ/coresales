import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const forgot_password_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C352E',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
        padding: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.05,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: width * 0.06,
        marginHorizontal: width * 0.01,
        alignItems: 'center',
    },
    iconContainer: {
        width: width * 0.3,
        height: width * 0.3,
        marginBottom: height * 0.03,
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: width * 0.055,
        fontWeight: '600' as '600',
        color: '#232323',
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    description: {
        fontSize: width * 0.04,
        color: '#61646B',
        textAlign: 'center',
        lineHeight: width * 0.06,
        marginBottom: height * 0.03,
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 8,
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
    errorContainer: {
        minHeight: 18,
        paddingTop: 2,
    },
    button: {
        backgroundColor: '#0C352E',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: height * 0.02,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width * 0.04,
        fontWeight: '600' as '600',
    },
    // Step 2: Code verification
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: height * 0.02,
    },
    codeInput: {
        width: width * 0.12,
        height: width * 0.12,
        borderWidth: 1,
        borderColor: '#D7D9CF',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: width * 0.05,
        color: '#232323',
    },
    resendText: {
        fontSize: width * 0.035,
        color: '#0FE58B',
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    // Step 4: Success
    successMessage: {
        fontSize: width * 0.04,
        color: '#61646B',
        textAlign: 'center',
        marginBottom: height * 0.04,
    },
});
