import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const TaskCardSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Animated.View style={[styles.title, { opacity }]} />
          <Animated.View style={[styles.subtitle, { opacity }]} />
        </View>
        <Animated.View style={[styles.badge, { opacity }]} />
      </View>
      <Animated.View style={[styles.description, { opacity }]} />
      <Animated.View style={[styles.descriptionShort, { opacity }]} />
      <View style={styles.footer}>
        <Animated.View style={[styles.time, { opacity }]} />
        <Animated.View style={[styles.status, { opacity }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    width: '70%',
    height: 18,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 6,
  },
  subtitle: {
    width: '40%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  badge: {
    width: 60,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  description: {
    width: '90%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 6,
  },
  descriptionShort: {
    width: '60%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    width: 80,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  status: {
    width: 70,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});
