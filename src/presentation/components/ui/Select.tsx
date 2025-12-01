import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  containerStyle?: object;
  required?: boolean;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function Select({
  label,
  error,
  containerStyle,
  required = false,
  options = [],
  value,
  onChange,
  placeholder,
}: SelectProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    if (dropdownVisible) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [dropdownVisible]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={[styles.selectText, !selectedOption && styles.placeholderText]} numberOfLines={1}>
            {selectedOption?.label || placeholder || 'Seleccionar'}
          </Text>
          <Animated.View style={[
            styles.arrowContainer,
            { transform: [{ rotate: dropdownVisible ? '180deg' : '0deg' }] }
          ]}>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#61646B" />
          </Animated.View>
        </TouchableOpacity>

        {dropdownVisible && (
          <>
            <TouchableOpacity 
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={() => setDropdownVisible(false)}
            />
            <Animated.View 
              style={[
                styles.dropdownContainer,
                {
                  maxHeight: animatedHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                  opacity: animatedOpacity,
                }
              ]}
            >
              <ScrollView 
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {options.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.dropdownItem,
                      item.value === value && styles.dropdownItemSelected
                    ]}
                    onPress={() => {
                      onChange?.(item.value);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      item.value === value && styles.dropdownItemTextSelected
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </>
        )}
      </View>
      
      <View style={styles.errorContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  label: {
    fontSize: width * 0.035,
    color: '#61646B',
    marginBottom: 4,
    fontWeight: '500',
  },
  required: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: width * 0.04,
    paddingRight: 40,
    position: 'relative',
  },
  selectText: {
    fontSize: width * 0.04,
    color: '#232323',
    fontWeight: '500',
    flex: 1,
  },
  arrowContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  placeholderText: {
    color: '#D3D3D3',
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#61646B',
  },
  dropdownIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  errorContainer: {
    minHeight: 20,
    paddingTop: 4,
  },
  errorText: {
    fontSize: width * 0.03,
    color: '#FF3B30',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 999,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#F5F5F5',
  },
  dropdownItemText: {
    fontSize: width * 0.04,
    color: '#232323',
  },
  dropdownItemTextSelected: {
    color: '#0C352E',
    fontWeight: '600',
  },
});
