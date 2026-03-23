import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const activities_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#0C352E',
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: '600' as '600',
        color: '#FFFFFF',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateScroll: {
        backgroundColor: '#F5F5F5',
        maxHeight: 110,
    },
    dateItem: {
        width: 70,
        height: 90,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginVertical: 10,
    },
    dateItemActive: {
        backgroundColor: '#0C352E',
    },
    dateMonth: {
        fontSize: 12,
        color: '#61646B',
        marginBottom: 4,
    },
    dateMonthActive: {
        color: '#FFFFFF',
    },
    dateDay: {
        fontSize: 28,
        fontWeight: '700' as '700',
        color: '#232323',
        marginBottom: 4,
    },
    dateDayActive: {
        color: '#FFFFFF',
    },
    dateDayName: {
        fontSize: 14,
        color: '#61646B',
    },
    dateDayNameActive: {
        color: '#FFFFFF',
    },
    filterTabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 12,
        backgroundColor: '#F5F5F5',
    },
    filterTab: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
    },
    filterTabActive: {
        backgroundColor: '#0C352E',
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: '600' as '600',
        color: '#232323',
    },
    filterTabTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
    },
    activityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    activityCardCompleted: {
        backgroundColor: '#F9FFF9',
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '600' as '600',
        color: '#232323',
        flex: 1,
    },
    activityTitleCompleted: {
        textDecorationLine: 'line-through' as 'line-through',
        color: '#61646B',
    },
    calendarIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityDescription: {
        fontSize: 14,
        color: '#61646B',
        marginBottom: 12,
    },
    activityFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activityTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityTimeText: {
        fontSize: 13,
        color: '#61646B',
        marginLeft: 6,
    },
    activityStatus: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#0FE58B',
        backgroundColor: '#F0FFF4',
    },
    activityStatusText: {
        fontSize: 12,
        fontWeight: '600' as '600',
        color: '#0FE58B',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
    },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    emptyIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#0C352E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyIconImage: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600' as '600',
        color: '#232323',
        marginBottom: 12,
    },
    emptyDescription: {
        fontSize: 15,
        color: '#61646B',
        textAlign: 'center',
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
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
        fontSize: 11,
        fontWeight: '600' as '600',
        color: '#232323',
    },
});
