import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { home_styles } from './styles/home-styles';

export default function HomeScreen() {
  const router = useRouter();
  const percentage = 70;
  const radius = 24;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <View style={home_styles.container}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }} />
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={home_styles.header}>
            <View style={home_styles.headerText}>
              <Text style={home_styles.greeting}>¡Hola Bienvenido!</Text>
              <Text style={home_styles.userName}>Abraham Moreno</Text>
            </View>
            <Image 
              source={require('@/assets/images/user-image.jpg')}
              style={home_styles.avatar}
            />
          </View>

          <View style={home_styles.content}>
            <View style={home_styles.totalCard}>
              <Text style={home_styles.totalLabel}>Total por cobrar</Text>
              <Text style={home_styles.totalAmount}>12.000.000 COP</Text>
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
                  <MaterialCommunityIcons name="chart-line" size={24} color="#0C352E" />
                </View>
                <View style={home_styles.performanceText}>
                  <Text style={home_styles.performanceTitle}>Rendimiento de ventas</Text>
                  <Text style={home_styles.performanceSubtitle}>100 Ventas confirmadas</Text>
                </View>
              </View>
              <View style={home_styles.progressCircle}>
                <Svg width={56} height={56}>
                  <Circle
                    cx={28}
                    cy={28}
                    r={radius}
                    stroke="#E5E5E5"
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
              onPress={() => router.push('/create-lead')}
            >
              <Ionicons name="person-add-outline" size={24} color="#FFFFFF" />
              <Text style={home_styles.addLeadText}>Agregar lead</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={home_styles.activitiesCard}
              onPress={() => router.push('/activities')}
              activeOpacity={0.7}
            >
              <View style={home_styles.sectionHeader}>
                <Text style={home_styles.sectionTitle}>Tus actividades para hoy</Text>
                <TouchableOpacity style={home_styles.addButton}>
                  <Feather name="plus" size={16} color="#232323" />
                </TouchableOpacity>
              </View>

              <View style={{ position: 'relative' }}>
                <View style={home_styles.activityItem}>
                  <View style={home_styles.activityIconContainer}>
                    <Feather name="calendar" size={20} color="#0C352E" />
                  </View>
                  <View style={home_styles.activityContent}>
                    <Text style={home_styles.activityTitle}>Prospeccion de Zona X</Text>
                    <Text style={home_styles.activityTime}>Diciembre | 09:10 AM</Text>
                  </View>
                </View>
                <View style={home_styles.activityLine} />
              </View>

              <View style={home_styles.activityItem}>
                <View style={home_styles.activityIconContainer}>
                  <Feather name="calendar" size={20} color="#0C352E" />
                </View>
                <View style={home_styles.activityContent}>
                  <Text style={home_styles.activityTitle}>Reunion con Cliente A</Text>
                  <Text style={home_styles.activityTime}>Diciembre | 09:10 AM</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={home_styles.recentCard}>
              <View style={home_styles.sectionHeader}>
                <Text style={home_styles.sectionTitle}>Actividad reciente</Text>
                <TouchableOpacity style={home_styles.addButton}>
                  <Feather name="plus" size={16} color="#232323" />
                </TouchableOpacity>
              </View>
              <View style={home_styles.recentItem}>
                <View style={home_styles.recentLeft}>
                  <Text style={home_styles.recentName}>Juan Perez</Text>
                  <Text style={home_styles.recentDescription}>Lead creado</Text>
                </View>
                <View style={home_styles.recentRight}>
                  <View style={[home_styles.statusBadge, { borderColor: '#FFB800', backgroundColor: '#FFF9E6' }]}>
                    <Text style={[home_styles.statusText, { color: '#FFB800' }]}>En revision</Text>
                  </View>
                  <Text style={home_styles.timeAgo}>Hace 2 horas</Text>
                </View>
              </View>

              <View style={home_styles.recentItem}>
                <View style={home_styles.recentLeft}>
                  <Text style={home_styles.recentName}>Ana Paola</Text>
                  <Text style={home_styles.recentDescription}>Venta registrada</Text>
                </View>
                <View style={home_styles.recentRight}>
                  <View style={[home_styles.statusBadge, { borderColor: '#FF6B6B', backgroundColor: '#FFE6E6' }]}>
                    <Text style={[home_styles.statusText, { color: '#FF6B6B' }]}>Pendiente</Text>
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
