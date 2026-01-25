import { useRouter } from "expo-router";
import {
  BriefcaseDollarIcon,
  Calendar03Icon,
  PlusSignSquareIcon,
  UserIdVerificationIcon,
} from "hugeicons-react-native";
import React, { memo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { home_styles } from "./styles/home-styles";

const BriefcaseIcon = memo(BriefcaseDollarIcon);
const UserIcon = memo(UserIdVerificationIcon);

export default function HomeScreen() {
  const router = useRouter();
  const percentage = 70;
  const radius = 24;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const STATIC_TOTAL_HEIGHT = 110;
  const MIN_BOTTOM_PADDING = 8;

  const insets = useSafeAreaInsets();
  const barBottomPadding = Math.max(insets.bottom, MIN_BOTTOM_PADDING);

  const finalContentMarginBottom = STATIC_TOTAL_HEIGHT + barBottomPadding;

  return (
    <>
      <View style={home_styles.container}>
        <SafeAreaView
          edges={["top"]}
          style={{
            backgroundColor: "#0C352E",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <View style={[home_styles.header, { paddingBottom: 20 }]}>
            <View style={home_styles.headerText}>
              <Text style={home_styles.greeting}>¡Hola Bienvenido!</Text>
              <Text style={home_styles.userName}>Abraham Moreno</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/(app)/(tabs)/profile");
              }}
            >
              <Image
                source={require("@/assets/images/user-image.jpg")}
                style={home_styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            paddingTop: 90,
            paddingBottom: finalContentMarginBottom,
          }}
        >
          <View
            style={{
              backgroundColor: "#0C352E",
              paddingBottom: 240,
              marginTop: -100,
            }}
          />

          <View style={home_styles.content}>
            <View style={home_styles.totalCard}>
              <Text style={home_styles.totalLabel}>Total por cobrar</Text>
              <Text style={home_styles.totalAmount}>12.000.000 COP</Text>
              <View
                style={{
                  borderWidth: 0.6,
                  borderColor: "#E9EEF8",
                  marginHorizontal: -20,
                }}
              />
              <View style={home_styles.statsRow}>
                <View style={home_styles.stat}>
                  <Text style={home_styles.statNumber}>50</Text>
                  <Text style={home_styles.statLabel}>Disponibles</Text>
                </View>
                <View style={home_styles.stat}>
                  <Text style={home_styles.statNumber}>100</Text>
                  <Text style={home_styles.statLabel}>Pendientes</Text>
                </View>
              </View>
            </View>

            <View style={home_styles.performanceCard}>
              <View style={home_styles.performanceLeft}>
                <View style={home_styles.performanceIcon}>
                  <BriefcaseIcon size={28} key={1} color="#0C352E" variant="stroke" />
                </View>
                <View style={home_styles.performanceText}>
                  <Text style={home_styles.performanceTitle}>
                    Rendimiento de ventas
                  </Text>
                  <Text style={home_styles.performanceSubtitle}>
                    100 Ventas confirmadas
                  </Text>
                </View>
              </View>
              <View style={home_styles.progressCircle}>
                <Svg width={56} height={56}>
                  <Circle
                    cx={28}
                    cy={28}
                    r={radius}
                    stroke="#A5C3BE"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <Circle
                    cx={28}
                    cy={28}
                    r={radius}
                    stroke="#0C352E"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="28, 28"
                  />
                </Svg>
                <Text style={home_styles.performancePercentage}>70%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={home_styles.addLeadButton}
              onPress={() => router.push("/leads/create")}
              activeOpacity={0.7}
            >
              <View style={home_styles.addLeadIcon}>
                <UserIcon key={2} size={28} color="#FFFFFF" variant="stroke" />
              </View>
              <Text style={home_styles.addLeadText}>Agregar lead</Text>
            </TouchableOpacity>

            <View style={home_styles.activitiesCard}>
              <View style={home_styles.sectionHeader}>
                <Text style={home_styles.sectionTitle}>
                  Tus actividades para hoy
                </Text>
                <TouchableOpacity
                  style={home_styles.addButton}
                  onPress={() => router.push("/activities")}
                  activeOpacity={0.7}
                >
                  <PlusSignSquareIcon
                    size={28}
                    color="#141B34"
                    variant="stroke"
                    key={3}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  borderWidth: 0.6,
                  borderColor: "#E9EEF8",
                  marginHorizontal: -20,
                }}
              />

              <View style={{ position: "relative", marginTop: 16 }}>
                <View style={home_styles.activityItem}>
                  <View style={home_styles.activityIconContainer}>
                    <Calendar03Icon
                      size={24}
                      color="#0C352E"
                      variant="stroke"
                      key={4}
                    />
                  </View>
                  <View style={home_styles.activityContent}>
                    <Text style={home_styles.activityTitle}>
                      Prospeccion de Zona X
                    </Text>
                    <Text style={home_styles.activityTime}>
                      Diciembre | 09:10 AM
                    </Text>
                  </View>
                </View>
                <View style={home_styles.activityLine} />
              </View>

              <View style={home_styles.activityItem}>
                <View style={home_styles.activityIconContainer}>
                  <Calendar03Icon key={5} size={24} color="#0C352E" variant="stroke" />
                </View>
                <View style={home_styles.activityContent}>
                  <Text style={home_styles.activityTitle}>
                    Reunion con Cliente A
                  </Text>
                  <Text style={home_styles.activityTime}>
                    Diciembre | 09:10 AM
                  </Text>
                </View>
              </View>
            </View>

            <View style={home_styles.recentCard}>
              <View style={home_styles.sectionHeader}>
                <Text style={home_styles.sectionTitle}>Actividad reciente</Text>
                <TouchableOpacity style={home_styles.addButton}>
                  <PlusSignSquareIcon
                    size={28}
                    color="#141B34"
                    variant="stroke"
                    key={6}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  borderWidth: 0.6,
                  borderColor: "#E9EEF8",
                  marginHorizontal: -20,
                }}
              />

              <View style={home_styles.recentItem}>
                <View style={home_styles.recentLeft}>
                  <Text style={home_styles.recentName}>Juan Perez</Text>
                  <Text style={home_styles.recentDescription}>Lead creado</Text>
                </View>
                <View style={home_styles.recentRight}>
                  <View
                    style={[
                      home_styles.statusBadge,
                      { borderColor: "#FFB800", backgroundColor: "#FFF9E6" },
                    ]}
                  >
                    <Text
                      style={[home_styles.statusText, { color: "#FFB800" }]}
                    >
                      En revision
                    </Text>
                  </View>
                  <Text style={home_styles.timeAgo}>Hace 2 horas</Text>
                </View>
              </View>

              <View style={home_styles.recentItem}>
                <View style={home_styles.recentLeft}>
                  <Text style={home_styles.recentName}>Ana Paola</Text>
                  <Text style={home_styles.recentDescription}>
                    Venta registrada
                  </Text>
                </View>
                <View style={home_styles.recentRight}>
                  <View
                    style={[
                      home_styles.statusBadge,
                      { borderColor: "#FF6B6B", backgroundColor: "#FFE6E6" },
                    ]}
                  >
                    <Text
                      style={[home_styles.statusText, { color: "#FF6B6B" }]}
                    >
                      Pendiente
                    </Text>
                  </View>
                  <Text style={home_styles.timeAgo}>Hace 4 horas</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
