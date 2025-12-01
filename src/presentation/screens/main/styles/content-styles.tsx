import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const content_styles = StyleSheet.create({
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F5F5F5',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    sortText: {
        fontSize: 14,
        color: '#61646B',
        marginRight: 4,
    },
    viewToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
        fontSize: 14,
        color: '#232323',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    // List view
    folderItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    folderIcon: {
        marginRight: 16,
    },
    folderInfo: {
        flex: 1,
    },
    folderName: {
        fontSize: 15,
        fontWeight: '600' as '600',
        color: '#232323',
        marginBottom: 4,
    },
    folderDetails: {
        fontSize: 12,
        color: '#61646B',
    },
    moreButton: {
        padding: 8,
    },
    // Grid view
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    gridHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    gridFolderName: {
        fontSize: 14,
        fontWeight: '600' as '600',
        color: '#232323',
        marginTop: 8,
    },
    gridFolderDetails: {
        fontSize: 11,
        color: '#61646B',
    },
    // File item
    fileItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    fileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '500' as '500',
        color: '#232323',
        marginBottom: 4,
    },
    fileSize: {
        fontSize: 12,
        color: '#61646B',
    },
});
