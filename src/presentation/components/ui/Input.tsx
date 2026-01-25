import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  InputProps,
  Text,
  Input as UIKittenInput,
} from "@ui-kitten/components";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface SelectOption {
  label: string;
  value: string;
}

interface CustomInputProps extends Omit<InputProps, "status" | "caption"> {
  label?: string;
  error?: string;
  containerStyle?: object;
  required?: boolean;
  hasSelect?: boolean;
  selectOptions?: SelectOption[];
  selectValue?: string;
  onSelectChange?: (value: string) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isDate?: boolean;
  dateValue?: Date;
  onDateChange?: (date: Date) => void;
}

export function Input({
  label,
  error,
  containerStyle,
  required = false,
  hasSelect = false,
  selectOptions = [],
  selectValue,
  onSelectChange,
  leftIcon,
  rightIcon,
  isDate = false,
  dateValue,
  onDateChange,
  style,
  ...props
}: CustomInputProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const selectedOption = selectOptions.find((opt) => opt.value === selectValue);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  if (isDate) {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateText, !dateValue && styles.datePlaceholder]}>
            {dateValue
              ? formatDate(dateValue)
              : props.placeholder || "DD/MM/AAAA"}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateValue || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDate && onDateChange) {
                onDateChange(selectedDate);
              }
            }}
          />
        )}

        <View style={styles.errorContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    );
  }

  if (hasSelect) {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        <View>
          <View style={styles.inputWithSelect}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={styles.pickerText} numberOfLines={1}>
                {selectedOption?.label || "CC"}
              </Text>
              <Animated.View
                style={[
                  styles.pickerArrow,
                  {
                    transform: [
                      { rotate: dropdownVisible ? "180deg" : "0deg" },
                    ],
                  },
                ]}
              >
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#61646B"
                />
              </Animated.View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TextInput style={styles.textInput} {...(props as any)} />
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </View>

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
                  },
                ]}
              >
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {selectOptions.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.dropdownItem,
                        item.value === selectValue &&
                          styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        onSelectChange?.(item.value);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          item.value === selectValue &&
                            styles.dropdownItemTextSelected,
                        ]}
                      >
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

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <UIKittenInput
          status={error ? "danger" : "basic"}
          style={[styles.input, style]}
          textStyle={styles.inputText}
          placeholderTextColor="#D3D3D3"
          {...props}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      <View style={styles.errorContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: width * 0.035,
    color: "#61646B",
    marginBottom: 4,
    fontWeight: "500",
  },
  required: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    height: 48,
  },
  inputWithSelect: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    height: 48,
  },
  pickerButton: {
    width: 80,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingRight: 28,
    position: "relative",
  },
  pickerText: {
    fontSize: width * 0.04,
    color: "#232323",
    fontWeight: "500",
    flex: 1,
  },
  pickerArrow: {
    position: "absolute",
    right: 4,
    top: 14,
  },
  dropdownIcon: {
    fontSize: 10,
    color: "#61646B",
    marginLeft: 4,
  },
  dropdownIconOpen: {
    transform: [{ rotate: "180deg" }],
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#D3D3D3",
  },
  textInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#232323",
    paddingHorizontal: width * 0.04,
  },
  dateText: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#232323",
    paddingHorizontal: width * 0.04,
  },
  datePlaceholder: {
    color: "#D3D3D3",
  },
  input: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  inputText: {
    fontSize: width * 0.04,
    color: "#232323",
  },
  iconLeft: {
    paddingLeft: width * 0.04,
    paddingRight: 8,
  },
  iconRight: {
    paddingRight: width * 0.04,
    paddingLeft: 8,
  },
  errorContainer: {
    minHeight: 20,
    paddingTop: 4,
  },
  errorText: {
    fontSize: width * 0.03,
    color: "#FF3B30",
  },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 999,
  },
  dropdownContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 23,
    maxHeight: 200,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemSelected: {
    backgroundColor: "#FFF",
  },
  dropdownItemText: {
    fontSize: width * 0.04,
    color: "#232323",
  },
  dropdownItemTextSelected: {
    color: "#0C352E",
    fontWeight: "600",
  },
});
