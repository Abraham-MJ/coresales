import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const activity_detail_styles = StyleSheet.create({
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
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 4,
        width: 40,
    },
    editButton: {
        padding: 4,
        width: 40,
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600' as '600',
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center' as 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    fieldContainer: {
        marginBottom: 24,
    },
    fieldHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600' as '600',
        color: '#232323',
    },
    fieldIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fieldValue: {
        fontSize: 14,
        color: '#61646B',
    },
    notesLabel: {
        fontSize: 14,
        fontWeight: '600' as '600',
        color: '#232323',
        marginBottom: 12,
    },
    notesInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 16,
        minHeight: 120,
        fontSize: 14,
        color: '#232323',
        textAlignVertical: 'top',
    },
    statusSection: {
        marginTop: 8,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#0C352E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0C352E',
    },
    statusLabel: {
        fontSize: 15,
        color: '#232323',
    },
    updateButton: {
        backgroundColor: '#0C352E',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600' as '600',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as '600',
        color: '#232323',
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 12,
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top' as 'top',
    },
    priorityBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    priorityHigh: {
        backgroundColor: '#FEE2E2',
    },
    priorityMedium: {
        backgroundColor: '#FEF3C7',
    },
    priorityLow: {
        backgroundColor: '#DBEAFE',
    },
    priorityText: {
        fontSize: 13,
        fontWeight: '600' as '600',
        color: '#232323',
    },
    statusInlineSection: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        flexWrap: 'wrap' as 'wrap',
    },
    statusInlineOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
