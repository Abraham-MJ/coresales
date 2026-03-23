import { DashboardSkeleton } from "@presentation/components/DashboardSkeleton";
import { FadeSlideView } from "@presentation/components/FadeSlideView";
import { useDashboard } from "@presentation/hooks/useDashboard";
import { API_CONFIG } from "@shared/constants/api.constants";
import { formatCurrency, formatNumber } from "@shared/utils/formatters";
import { useRouter } from "expo-router";
import {
  BriefcaseDollarIcon,
  Calendar03Icon,
  PlusSignSquareIcon,
  UserIdVerificationIcon,
} from "hugeicons-react-native";
import React, { memo, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
  const { data, userAvatar, loading, error, refresh } = useDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const radius = 24;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  
  const percentage = data?.dashboard.stats.sales_target_percentage || 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const STATIC_TOTAL_HEIGHT = 110;
  const MIN_BOTTOM_PADDING = 8;

  const insets = useSafeAreaInsets();
  const barBottomPadding = Math.max(insets.bottom, MIN_BOTTOM_PADDING);

  const finalContentMarginBottom = STATIC_TOTAL_HEIGHT + barBottomPadding;

  const onRefresh = async () => {
    setIsRefreshing(true);
    
    await Promise.all([
      refresh(),
      new Promise(resolve => setTimeout(resolve, 800))
    ]);
    
    setIsRefreshing(false);
  };

  if ((loading && !data) || isRefreshing) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <View style={[home_styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#FF3B30', textAlign: 'center', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Error al cargar dashboard
        </Text>
        <Text style={{ color: '#61646B', textAlign: 'center', marginBottom: 24 }}>
          {error || 'Ocurrió un error inesperado'}
        </Text>
        <TouchableOpacity
          onPress={refresh}
          style={{
            backgroundColor: '#0C352E',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { dashboard, workspace } = data;
  const fullName = `${dashboard.sales_rep.first_names} ${dashboard.sales_rep.last_names}`;

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
          pointerEvents="box-none"
        >
          <View style={[home_styles.header, { paddingBottom: 20 }]} pointerEvents="auto">
            <View style={home_styles.headerText}>
              <Text style={home_styles.greeting}>¡Hola Bienvenido!</Text>
              <Text style={home_styles.userName}>{fullName}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/(app)/(tabs)/profile");
              }}
              accessible={true}
              accessibilityLabel="Ver perfil"
              accessibilityRole="button"
              accessibilityHint="Abre tu perfil de usuario"
            >
              <Image
                source={
                  userAvatar
                    ? { uri: `${API_CONFIG.DOMAIN_URL}${userAvatar}` }
                    : require("@/assets/images/user-image.jpg")
                }
                style={home_styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={["#0C352E"]}
            />
          }
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
            <FadeSlideView delay={0}>
              <View style={home_styles.totalCard}>
                <Text style={home_styles.totalLabel}>Total por cobrar</Text>
                <Text style={home_styles.totalAmount}>
                  {formatCurrency(dashboard.stats.total_receivable, workspace.currency_code)}
                </Text>
                <View
                  style={{
                    borderWidth: 0.6,
                    borderColor: "#E9EEF8",
                    marginHorizontal: -20,
                  }}
                />
                <View style={home_styles.statsRow}>
                  <View style={home_styles.stat}>
                    <Text style={home_styles.statNumber}>
                      {formatNumber(dashboard.stats.leads_available)}
                    </Text>
                    <Text style={home_styles.statLabel}>Disponibles</Text>
                  </View>
                  <View style={home_styles.stat}>
                    <Text style={home_styles.statNumber}>
                      {formatNumber(dashboard.stats.leads_pending)}
                    </Text>
                    <Text style={home_styles.statLabel}>Pendientes</Text>
                  </View>
                </View>
              </View>
            </FadeSlideView>

            <FadeSlideView delay={100}>
            <View style={home_styles.performanceCard}>
              <View style={home_styles.performanceLeft}>
                <View style={home_styles.performanceIcon}>
                  <BriefcaseIcon size={28} color="#0C352E" variant="stroke" />
                </View>
                <View style={home_styles.performanceText}>
                  <Text style={home_styles.performanceTitle}>
                    Rendimiento de ventas
                  </Text>
                  <Text style={home_styles.performanceSubtitle}>
                    {formatNumber(dashboard.stats.sales_completed)} Ventas confirmadas
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
                <Text style={home_styles.performancePercentage}>{percentage}%</Text>
              </View>
            </View>
            </FadeSlideView>

            <FadeSlideView delay={150}>
            <TouchableOpacity
              style={home_styles.addLeadButton}
              onPress={() => router.push("/leads/create")}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel="Agregar nuevo lead"
              accessibilityRole="button"
              accessibilityHint="Crea un nuevo lead en el sistema"
            >
              <View style={home_styles.addLeadIcon}>
                <UserIcon size={28} color="#FFFFFF" variant="stroke" />
              </View>
              <Text style={home_styles.addLeadText}>Agregar lead</Text>
            </TouchableOpacity>
            </FadeSlideView>

            <FadeSlideView delay={200}>
            <View style={home_styles.activitiesCard}>
              <View style={home_styles.sectionHeader}>
                <Text style={home_styles.sectionTitle}>
                  Tus actividades para hoy
                </Text>
                <TouchableOpacity
                  style={home_styles.addButton}
                  onPress={() => router.push("/activities")}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel="Ver todas las actividades"
                  accessibilityRole="button"
                >
                  <PlusSignSquareIcon
                    size={28}
                    color="#141B34"
                    variant="stroke"
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

              {data.tasks.length > 0 ? (
                data.tasks
                  .filter(task => {
                    // Filtrar solo tareas de hoy
                    if (!task.due_date) return false;
                    const taskDate = new Date(task.due_date);
                    const today = new Date();
                    return (
                      taskDate.getUTCFullYear() === today.getFullYear() &&
                      taskDate.getUTCMonth() === today.getMonth() &&
                      taskDate.getUTCDate() === today.getDate()
                    );
                  })
                  .slice(0, 3) // Limitar a 3 tareas
                  .map((task, index) => (
                  <View key={task.id} style={{ position: "relative", marginTop: index === 0 ? 16 : 0 }}>
                    <View style={home_styles.activityItem}>
                      <View style={home_styles.activityIconContainer}>
                        <Calendar03Icon
                          size={24}
                          color="#0C352E"
                          variant="stroke"
                        />
                      </View>
                      <View style={home_styles.activityContent}>
                        <Text style={home_styles.activityTitle}>
                          {task.title}
                        </Text>
                        <Text style={home_styles.activityTime}>
                          {task.due_date ? (() => {
                            const date = new Date(task.due_date);
                            const day = date.getUTCDate();
                            const month = date.toLocaleDateString('es-ES', { 
                              month: 'long',
                              timeZone: 'UTC'
                            });
                            return `${day} de ${month}`;
                          })() : 'Sin fecha'}
                        </Text>
                      </View>
                    </View>
                    {index < 2 && <View style={home_styles.activityLine} />}
                  </View>
                ))
              ) : (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>📅</Text>
                  <Text style={{ color: '#141B34', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                    No hay tareas para hoy
                  </Text>
                  <Text style={{ color: '#61646B', fontSize: 14, textAlign: 'center' }}>
                    Crea una nueva tarea para organizar tu día
                  </Text>
                </View>
              )}
            </View>
            </FadeSlideView>

            <FadeSlideView delay={250}>
            <View style={home_styles.recentCard}>
              <View style={home_styles.sectionHeader}>
                <Text style={home_styles.sectionTitle}>Actividad reciente</Text>
              </View>

              <View
                style={{
                  borderWidth: 0.6,
                  borderColor: "#E9EEF8",
                  marginHorizontal: -20,
                }}
              />

              {data.activityFeed.length > 0 ? (
                data.activityFeed.slice(0, 2).map((activity) => (
                  <View key={activity.id} style={home_styles.recentItem}>
                    <View style={home_styles.recentLeft}>
                      <Text style={home_styles.recentName}>{activity.title}</Text>
                      <Text style={home_styles.recentDescription}>{activity.description}</Text>
                    </View>
                    <View style={home_styles.recentRight}>
                      <View
                        style={[
                          home_styles.statusBadge,
                          { 
                            borderColor: activity.status_color || "#FFB800", 
                            backgroundColor: `${activity.status_color || "#FFB800"}20` 
                          },
                        ]}
                      >
                        <Text
                          style={[home_styles.statusText, { color: activity.status_color || "#FFB800" }]}
                        >
                          {activity.status}
                        </Text>
                      </View>
                      <Text style={home_styles.timeAgo}>{activity.time_ago}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ color: '#141B34', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                    Sin actividad reciente
                  </Text>
                  <Text style={{ color: '#61646B', fontSize: 14, textAlign: 'center' }}>
                    Tus acciones aparecerán aquí
                  </Text>
                </View>
              )}
            </View>
            </FadeSlideView>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
