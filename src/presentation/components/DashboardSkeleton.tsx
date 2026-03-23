import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const DashboardSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const STATIC_TOTAL_HEIGHT = 110;
  const MIN_BOTTOM_PADDING = 8;
  const barBottomPadding = Math.max(insets.bottom, MIN_BOTTOM_PADDING);
  const finalContentMarginBottom = STATIC_TOTAL_HEIGHT + barBottomPadding;

  return (
    <View style={styles.container}>
      {/* Header fijo */}
      <SafeAreaView
        edges={['top']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Animated.View style={[styles.greetingLine, { opacity }]} />
            <Animated.View style={[styles.nameLine, { opacity }]} />
          </View>
          <Animated.View style={[styles.avatar, { opacity }]} />
        </View>
      </SafeAreaView>

      {/* ScrollView con contenido */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{
          paddingTop: 90,
          paddingBottom: finalContentMarginBottom,
        }}
      >
        {/* Spacer verde */}
        <View style={styles.spacer} />

        <View style={styles.content}>
          {/* Card Total por cobrar */}
          <View style={styles.totalCard}>
            <Animated.View style={[styles.totalLabel, { opacity }]} />
            <Animated.View style={[styles.totalAmount, { opacity }]} />
            <View style={styles.divider} />
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Animated.View style={[styles.statNumber, { opacity }]} />
                <Animated.View style={[styles.statLabel, { opacity }]} />
              </View>
              <View style={styles.stat}>
                <Animated.View style={[styles.statNumber, { opacity }]} />
                <Animated.View style={[styles.statLabel, { opacity }]} />
              </View>
            </View>
          </View>

          {/* Card Rendimiento */}
          <View style={styles.performanceCard}>
            <View style={styles.performanceLeft}>
              <Animated.View style={[styles.performanceIcon, { opacity }]} />
              <View>
                <Animated.View style={[styles.performanceTitle, { opacity }]} />
                <Animated.View style={[styles.performanceSubtitle, { opacity }]} />
              </View>
            </View>
            <Animated.View style={[styles.progressCircle, { opacity }]} />
          </View>

          {/* Botón Agregar Lead */}
          <Animated.View style={[styles.addLeadButton, { opacity }]} />

          {/* Card Actividades */}
          <View style={styles.activitiesCard}>
            <View style={styles.cardHeader}>
              <Animated.View style={[styles.sectionTitle, { opacity }]} />
              <Animated.View style={[styles.addButton, { opacity }]} />
            </View>
            <View style={styles.divider} />
            <View style={styles.activityItem}>
              <Animated.View style={[styles.activityIcon, { opacity }]} />
              <View style={{ flex: 1, paddingTop: 4 }}>
                <Animated.View style={[styles.activityTitle, { opacity }]} />
                <Animated.View style={[styles.activityTime, { opacity }]} />
              </View>
            </View>
            <View style={styles.activityItem}>
              <Animated.View style={[styles.activityIcon, { opacity }]} />
              <View style={{ flex: 1, paddingTop: 4 }}>
                <Animated.View style={[styles.activityTitle, { opacity }]} />
                <Animated.View style={[styles.activityTime, { opacity }]} />
              </View>
            </View>
          </View>

          {/* Card Actividad Reciente */}
          <View style={styles.recentCard}>
            <Animated.View style={[styles.sectionTitle, { opacity, marginBottom: 12 }]} />
            <View style={styles.divider} />
            <View style={styles.recentItem}>
              <View style={{ flex: 1 }}>
                <Animated.View style={[styles.recentName, { opacity }]} />
                <Animated.View style={[styles.recentDescription, { opacity }]} />
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Animated.View style={[styles.statusBadge, { opacity }]} />
                <Animated.View style={[styles.timeAgo, { opacity }]} />
              </View>
            </View>
            <View style={styles.recentItem}>
              <View style={{ flex: 1 }}>
                <Animated.View style={[styles.recentName, { opacity }]} />
                <Animated.View style={[styles.recentDescription, { opacity }]} />
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Animated.View style={[styles.statusBadge, { opacity }]} />
                <Animated.View style={[styles.timeAgo, { opacity }]} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F1F3',
  },
  header: {
    backgroundColor: '#0C352E',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: width * 0.03,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingLine: {
    width: 150,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginBottom: 4,
  },
  nameLine: {
    width: 200,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#D7D9CF',
  },
  spacer: {
    backgroundColor: '#0C352E',
    paddingBottom: 240,
    marginTop: -100,
  },
  content: {
    paddingHorizontal: width * 0.03,
    marginTop: -75,
  },
  totalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  totalLabel: {
    width: 120,
    height: 14,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
    marginBottom: 12,
    alignSelf: 'center',
  },
  totalAmount: {
    width: 180,
    height: 32,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
    marginBottom: 20,
    alignSelf: 'center',
  },
  divider: {
    borderWidth: 0.6,
    borderColor: '#E9EEF8',
    marginHorizontal: -20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumber: {
    width: 40,
    height: 18,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
    marginRight: 4,
  },
  statLabel: {
    width: 80,
    height: 16,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  performanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#A5C3BE',
    marginRight: 12,
  },
  performanceTitle: {
    width: 140,
    height: 16,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
    marginBottom: 4,
  },
  performanceSubtitle: {
    width: 120,
    height: 14,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E9EEF8',
  },
  addLeadButton: {
    backgroundColor: '#0C352E',
    borderRadius: 18,
    height: 54,
    marginBottom: 16,
  },
  activitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  sectionTitle: {
    width: 180,
    height: 16,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E9EEF8',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9EEF8',
    marginRight: 12,
  },
  activityTitle: {
    width: '80%',
    height: 16,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
    marginBottom: 4,
  },
  activityTime: {
    width: '60%',
    height: 14,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  recentName: {
    width: '70%',
    height: 16,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
    marginBottom: 4,
  },
  recentDescription: {
    width: '90%',
    height: 14,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
  },
  statusBadge: {
    width: 80,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E9EEF8',
    marginBottom: 4,
  },
  timeAgo: {
    width: 60,
    height: 12,
    backgroundColor: '#E9EEF8',
    borderRadius: 4,
  },
});
