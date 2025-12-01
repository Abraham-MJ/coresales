import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import { sales_styles } from './styles/sales-styles';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SalesScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [location, setLocation] = useState({
    latitude: 4.7110,
    longitude: -74.0721,
  });
  const [hasAvailability, setHasAvailability] = useState(true);

  const getStepIcon = () => {
    switch(step) {
      case 1: return 'map-pin';
      case 2: return 'user';
      case 3: return 'file-text';
      case 4: return 'credit-card';
      default: return 'map-pin';
    }
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return 'Ubicación';
      case 2: return 'Cliente';
      case 3: return 'Contrato';
      case 4: return 'Pago';
      default: return 'Ubicación';
    }
  };

  const getStepSubtitle = () => {
    switch(step) {
      case 1: return 'Dónde te conectaremos';
      case 2: return '¿Quién será el titular del servicio?';
      case 3: return 'Elige tu plan ideal';
      case 4: return 'Configura tu forma de pago';
      default: return 'Dónde te conectaremos';
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <View style={sales_styles.container}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }}>
          <View style={sales_styles.header}>
            <TouchableOpacity 
              style={sales_styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={sales_styles.headerContent}>
              <View style={sales_styles.stepIndicator}>
                <Feather name={getStepIcon()} size={28} color="#FFFFFF" />
                <Text style={sales_styles.stepText}>{step}/4</Text>
              </View>
              
              <View style={sales_styles.headerTextContainer}>
                <Text style={sales_styles.headerTitle}>{getStepTitle()}</Text>
                <Text style={sales_styles.headerSubtitle}>{getStepSubtitle()}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView 
          style={sales_styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={sales_styles.form}>
            <View style={sales_styles.field}>
              <Text style={sales_styles.label}>Dirección</Text>
              <TextInput
                style={sales_styles.input}
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="#D0D0D0"
              />
            </View>

            <View style={sales_styles.field}>
              <Text style={sales_styles.label}>Referencia</Text>
              <TextInput
                style={sales_styles.input}
                value={reference}
                onChangeText={setReference}
                placeholderTextColor="#D0D0D0"
              />
            </View>

            <View style={sales_styles.mapContainer}>
              <MapView
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={(e) => setLocation(e.nativeEvent.coordinate)}
              >
                <Marker 
                  coordinate={location}
                  anchor={{ x: 0.5, y: 0.5 }}
                  centerOffset={{ x: 0, y: 0 }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#0C352E', justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name="map-pin" size={24} color="#0FE58B" />
                  </View>
                </Marker>
                <Circle
                  center={location}
                  radius={200}
                  fillColor="rgba(15, 229, 139, 0.2)"
                  strokeColor="rgba(15, 229, 139, 0.5)"
                  strokeWidth={2}
                />
              </MapView>
            </View>

            <View style={sales_styles.alertCard}>
              <View style={sales_styles.alertIcon}>
                <Feather name={hasAvailability ? "check-circle" : "x-circle"} size={20} color={hasAvailability ? "#0FE58B" : "#FF6B6B"} />
              </View>
              <Text style={sales_styles.alertText}>
                {hasAvailability 
                  ? "Si hay disponibilidad en tu ubicación\nPuedes continuar con la venta o guardar el lead"
                  : "Esta zona no tiene cobertura actualmente\nEl cliente puede ser registrado como lead para contactarlo cuando esté disponible"
                }
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={sales_styles.nextButton}
          onPress={() => setStep(step + 1)}
        >
          <Text style={sales_styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
