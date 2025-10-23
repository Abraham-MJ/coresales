import { StyleSheet } from "react-native";


export const login_styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    headerContent: {
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    logoContainer: {
        marginBottom: 20,
    },

    logo: {
        width: 150,
        height: 150,
    },

    title: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    bottomSection: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },

    button: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 16,
    },

    loginCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        zIndex: 1000,
    },

    handle: {
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 25,
        paddingVertical: 10,
        paddingHorizontal: 30,
    },

    handleButton: {
        width: 50,
        height: 5,
        backgroundColor: '#D0D0D0',
        borderRadius: 3,
    },

    cardContent: {
        flex: 1,
        paddingHorizontal: 24,
    },

    form: {
        gap: 20,
    },
});