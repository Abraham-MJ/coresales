import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/Input';
import { create_lead_styles } from './styles/create-lead-styles';

export default function CreateLeadScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [docType, setDocType] = useState('V');
  const [docNumber, setDocNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('+57');
  const [phone, setPhone] = useState('');
  const [phoneCode2, setPhoneCode2] = useState('+57');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [location, setLocation] = useState({
    latitude: 4.7110,
    longitude: -74.0721,
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <View style={create_lead_styles.container}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }}>
          <View style={create_lead_styles.header}>
            <TouchableOpacity 
              style={create_lead_styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={create_lead_styles.headerTitle}>Lead</Text>
          </View>
        </SafeAreaView>

        <ScrollView 
          style={create_lead_styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={create_lead_styles.form}>
            <View style={create_lead_styles.row}>
              <Input
                label="Nombres"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Ana"
                containerStyle={create_lead_styles.halfField}
              />
              <Input
                label="Apellidos"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Cardozo"
                containerStyle={create_lead_styles.halfField}
              />
            </View>

            <Input
              label="Documento de identidad"
              hasSelect
              selectOptions={[
                { label: 'V', value: 'V' },
                { label: 'P', value: 'P' },
                { label: 'J', value: 'J' },
              ]}
              selectValue={docType}
              onSelectChange={setDocType}
              value={docNumber}
              onChangeText={setDocNumber}
              placeholder="331030493"
              keyboardType="numeric"
              rightIcon={<Feather name="check" size={18} color="#0FE58B" />}
            />

            <Input
              label="Teléfono"
              hasSelect
              selectOptions={[
                { label: '+57', value: '+57' },
                { label: '+1', value: '+1' },
                { label: '+58', value: '+58' },
              ]}
              selectValue={phoneCode}
              onSelectChange={setPhoneCode}
              value={phone}
              onChangeText={setPhone}
              placeholder="(412)-026-3093"
              keyboardType="phone-pad"
            />

            <Input
              label="Teléfono secundario"
              hasSelect
              selectOptions={[
                { label: '+57', value: '+57' },
                { label: '+1', value: '+1' },
                { label: '+58', value: '+58' },
              ]}
              selectValue={phoneCode2}
              onSelectChange={setPhoneCode2}
              value={phone2}
              onChangeText={setPhone2}
              placeholder="(412)-026-3093"
              keyboardType="phone-pad"
            />

            <Input
              label="Correo eléctronico"
              value={email}
              onChangeText={setEmail}
              placeholder="anapuki@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              rightIcon={<Feather name="check" size={18} color="#0FE58B" />}
            />

            <Input
              label="Dirección"
              value={address}
              onChangeText={setAddress}
            />

            <Input
              label="Referencia"
              value={reference}
              onChangeText={setReference}
            />

            <View style={create_lead_styles.mapContainer}>
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
                  <View style={create_lead_styles.mapIcon}>
                    <Feather name="map-pin" size={28} color="#0FE58B" />
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
          </View>
        </ScrollView>

        <TouchableOpacity style={create_lead_styles.nextButton}>
          <Text style={create_lead_styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
