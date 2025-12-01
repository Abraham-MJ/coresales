import Feather from '@expo/vector-icons/Feather';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);

  const currentRoute = state.routes[state.index];
  const { options } = descriptors[currentRoute.key];
  
  if (options.tabBarStyle && 'display' in options.tabBarStyle && options.tabBarStyle.display === 'none') {
    return null;
  }

  return (
    <View style={[styles.container, { height: tabBarHeight }]}>
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = 
            typeof options.tabBarLabel === 'string' 
              ? options.tabBarLabel 
              : options.title ?? route.name;
          const isFocused = state.index === index;

          if (index === 2) {
            return <View key={route.key} style={styles.tabItem} />;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIcon = () => {
            const size = 24;

            switch (index) {
              case 0:
                return <Image source={require('../../../assets/images/home-icon.png')} style={{ width: size, height: size, tintColor: isFocused ? '#0C352E' : '#9CA3AF' }} />;
              case 1:
                return <Image source={require('../../../assets/images/venta-icon.png')} style={{ width: size, height: size, tintColor: isFocused ? '#0C352E' : '#9CA3AF' }} />;
              case 3:
                return <Image source={require('../../../assets/images/contenido-icon.png')} style={{ width: size, height: size, tintColor: isFocused ? '#0C352E' : '#9CA3AF' }} />;
              case 4:
                return <Image source={require('../../../assets/images/profile-icon.png')} style={{ width: size, height: size, tintColor: isFocused ? '#0C352E' : '#9CA3AF' }} />;
              default:
                return null;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {getIcon()}
              <Text style={[styles.label, { color: isFocused ? '#0C352E' : '#9CA3AF' }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('search')}
      >
        <Feather name="search" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    top: -28,
    left: width / 2 - 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0C352E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
