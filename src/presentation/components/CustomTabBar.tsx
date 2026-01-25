import Feather from "@expo/vector-icons/Feather";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Folder01Icon,
  Home01Icon,
  ShoppingCartAdd02Icon,
  UserMultiple02Icon,
} from "hugeicons-react-native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const STATIC_TOTAL_HEIGHT = 65;
const CURVE_SIZE = 130;
const FAB_SIZE = 56;
const CURVE_DEPTH = 40;
const BAR_CONTENT_HEIGHT = STATIC_TOTAL_HEIGHT - CURVE_DEPTH;

const getSvgPath = (w: number, h: number): string => {
  const center = w / 2;
  const R = CURVE_SIZE / 2;
  const D = CURVE_DEPTH;
  const smoothness = R / 2;
  const topY = 0;

  let path = `M0,${topY} H${center - R}`;

  path += `C ${center - R + smoothness}, ${topY}, 
            ${center - smoothness}, ${D}, 
            ${center}, ${D}`;

  path += `C ${center + smoothness}, ${D},
            ${center + R - smoothness}, ${topY},
            ${center + R}, ${topY}`;

  path += `H${w} V${h} L0,${h} Z`;

  return path;
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const barBottomPadding = Math.max(insets.bottom, 8);
  const svgHeight = STATIC_TOTAL_HEIGHT + barBottomPadding;
  const totalBarContentHeight = BAR_CONTENT_HEIGHT + barBottomPadding;

  const currentRoute = state.routes[state.index];
  const { options } = descriptors[currentRoute.key];

  if (
    options.tabBarStyle &&
    "display" in options.tabBarStyle &&
    options.tabBarStyle.display === "none"
  ) {
    return null;
  }

  return (
    <View style={[styles.mainContainer, { height: svgHeight }]}>
      <View style={[styles.svgContainer, { height: svgHeight }]}>
        <Svg width={width} height={svgHeight}>
          <Path
            d={getSvgPath(width, svgHeight)}
            fill="#FFFFFF"
            stroke="#E5E7EB"
            strokeWidth={0.5}
          />
        </Svg>
      </View>

      <View
        style={[
          styles.tabBarContent,
          {
            height: totalBarContentHeight,
            top: 20,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title ?? route.name;
          const isFocused = state.index === index;

          if (index === 2) {
            return <View key={route.key} style={styles.tabItem} />;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIcon = () => {
            const size = 28;
            const color = isFocused ? "#0C352E" : "#9CA3AF";

            switch (index) {
              case 0:
                return (
                  <Home01Icon
                    size={size}
                    color={color}
                    variant="stroke"
                    key={10}
                  />
                );
              case 1:
                return (
                  <ShoppingCartAdd02Icon
                    size={size}
                    color={color}
                    variant="stroke"
                    key={9}
                  />
                );
              case 3:
                return (
                  <Folder01Icon
                    size={size}
                    color={color}
                    variant="stroke"
                    key={8}
                  />
                );
              case 4:
                return (
                  <UserMultiple02Icon
                    size={size}
                    color={color}
                    variant="stroke"
                    key={7}
                  />
                );
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
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? "#0C352E" : "#9CA3AF" },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("search")}
      >
        <Feather name="search" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    bottom: 0,
    width: width,
  },

  svgContainer: {
    position: "absolute",
    top: 0,
    width: width,
    zIndex: 1,
  },

  tabBarContent: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    width: width,
    zIndex: 2,
  },

  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },

  label: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },

  fab: {
    position: "absolute",
    top: -30,
    left: width / 2 - FAB_SIZE / 2,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: "#0C352E",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
});
