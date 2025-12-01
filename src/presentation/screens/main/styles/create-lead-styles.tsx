import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get('window');

export const create_lead_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#0C352E',
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600' as '600',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    form: {
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    halfField: {
        width: '48%',
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        color: '#61646B',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        fontSize: 14,
        color: '#232323',
    },
    pickerContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        height: 48,
        overflow: 'hidden',
    },
    picker: {
        width: 80,
        height: 48,
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#232323',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    inputText: {
        flex: 1,
        fontSize: 14,
        color: '#232323',
    },
    mapContainer: {
        height: 250,
        backgroundColor: '#E5E5E5',
        borderRadius: 12,
        overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    mapIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0C352E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: '#0C352E',
        borderRadius: 12,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600' as '600',
    },
});
