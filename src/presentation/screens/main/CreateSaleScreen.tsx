import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useRouter, useFocusEffect } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import SignatureCanvas from 'react-native-signature-canvas';
import { sales_styles } from './styles/sales-styles';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function CreateSaleScreen() {
  const router = useRouter();
  const signatureRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const [isSigningActive, setIsSigningActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setStep(1);
      setShowSuccess(false);
    }, [])
  );
  
  // Step 1
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [location, setLocation] = useState({ latitude: 4.7110, longitude: -74.0721 });
  const [hasAvailability, setHasAvailability] = useState(true);
  
  // Step 2
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('+57');
  const [phone, setPhone] = useState('');
  const [phoneCode2, setPhoneCode2] = useState('+57');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [observations, setObservations] = useState('');
  
  // Step 3
  const [saleDate, setSaleDate] = useState('');
  const [branch, setBranch] = useState('');
  const [zone, setZone] = useState('');
  const [plan, setPlan] = useState('');
  const [saleType, setSaleType] = useState('');
  const [signature, setSignature] = useState('');
  
  // Step 4
  const [payments, setPayments] = useState([{ method: '', amount: '', reference: '' }]);

  const getStepDisplay = () => {
    switch(step) {
      case 1: return { current: 1, total: 4 };
      case 2: return { current: 1, total: 2 };
      case 3: return { current: 1, total: 3 };
      case 4: return { current: 1, total: 4 };
      default: return { current: 1, total: 4 };
    }
  };

  const stepDisplay = getStepDisplay();
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;
  const radius = 32;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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

  const handleSignature = (sig: string) => {
    setSignature(sig);
  };

  const clearSignature = () => {
    signatureRef.current?.clearSignature();
  };

  const addPayment = () => {
    setPayments([...payments, { method: '', amount: '', reference: '' }]);
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <>
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
                <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
                  <View style={sales_styles.markerIcon}>
                    <Feather name="map-pin" size={28} color="#0FE58B" />
                  </View>
                </Marker>
                <Circle
                  center={location}
                  radius={200}
                  fillColor="rgba(15, 229, 139, 0.15)"
                  strokeColor="rgba(15, 229, 139, 0.4)"
                  strokeWidth={2}
                />
              </MapView>
            </View>

            <View style={sales_styles.alertCard}>
              <View style={[sales_styles.alertIconContainer, { backgroundColor: hasAvailability ? '#F0FFF4' : '#FFE6E6' }]}>
                <Feather 
                  name={hasAvailability ? "check-circle" : "x-circle"} 
                  size={24} 
                  color={hasAvailability ? "#0FE58B" : "#FF6B6B"} 
                />
              </View>
              <View style={sales_styles.alertTextContainer}>
                <Text style={sales_styles.alertTitle}>
                  {hasAvailability ? "Si hay disponibilidad en tu ubicación" : "Esta zona no tiene cobertura actualmente"}
                </Text>
                <Text style={sales_styles.alertDescription}>
                  {hasAvailability ? "Puedes continuar con la venta o guardar el lead" : "El cliente puede ser registrado como lead para contactarlo cuando esté disponible"}
                </Text>
              </View>
            </View>
          </>
        );

      case 2:
        return (
          <>
            <View style={sales_styles.row}>
              <Input
                label="Nombres"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Ana"
                containerStyle={sales_styles.halfField}
              />
              <Input
                label="Apellidos"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Cardozo"
                containerStyle={sales_styles.halfField}
              />
            </View>

            <Input
              label="Documento de identidad"
              hasSelect
              selectOptions={[
                { label: 'CC', value: 'CC' },
                { label: 'CE', value: 'CE' },
                { label: 'PA', value: 'PA' },
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
                { label: '+52', value: '+52' },
              ]}
              selectValue={phoneCode}
              onSelectChange={setPhoneCode}
              value={phone}
              onChangeText={setPhone}
              placeholder="(331)-030-4933"
              keyboardType="phone-pad"
            />

            <Input
              label="Teléfono secundario"
              hasSelect
              selectOptions={[
                { label: '+57', value: '+57' },
                { label: '+1', value: '+1' },
                { label: '+52', value: '+52' },
              ]}
              selectValue={phoneCode2}
              onSelectChange={setPhoneCode2}
              value={phone2}
              onChangeText={setPhone2}
              placeholder="(331)-030-4933"
              keyboardType="phone-pad"
            />

            <Input
              label="Correo eléctronico"
              value={email}
              onChangeText={setEmail}
              placeholder="anapuki@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
                  placeholderTextColor="#D0D0D0"
              rightIcon={<Feather name="check" size={18} color="#0FE58B" />}
            />

            <Input
              label="Forma de contacto"
              value={contactMethod}
              onChangeText={setContactMethod}
              placeholder="Red social"
            />

            <Input
              label="Observaciones"
              value={observations}
              onChangeText={setObservations}
              multiline
              numberOfLines={4}
            />
          </>
        );

      case 3:
        return (
          <>
            <Input
              label="Fecha de venta"
              isDate
              dateValue={saleDate ? new Date(saleDate) : undefined}
              onDateChange={(date) => setSaleDate(date.toLocaleDateString())}
              placeholder="DD/MM/AAAA"
              rightIcon={<Feather name="calendar" size={18} color="#D7D9CF" />}
            />

            <Select
              label="Sucursal"
              options={[
                { label: 'Matriz', value: 'matriz' },
              ]}
              value={branch}
              onChange={setBranch}
            />

            <Select
              label="Zona"
              options={[
                { label: 'Principal', value: 'principal' },
              ]}
              value={zone}
              onChange={setZone}
            />

            <Select
              label="Plan a contratar"
              options={[
                { label: 'Super Plan BBB', value: 'super_plan' },
              ]}
              value={plan}
              onChange={setPlan}
            />

            <Select
              label="Tipo de venta"
              options={[
                { label: 'Contado', value: 'contado' },
              ]}
              value={saleType}
              onChange={setSaleType}
            />

            <View style={sales_styles.signatureContainer}>
              <View style={sales_styles.signatureHeader}>
                <Text style={sales_styles.label}>Firma</Text>
                <TouchableOpacity onPress={clearSignature}>
                  <Text style={sales_styles.clearButton}>Limpiar</Text>
                </TouchableOpacity>
              </View>
              <View 
                style={{ height: 150, borderBottomWidth: 2, borderBottomColor: '#232323' }}
                onTouchStart={() => setIsSigningActive(true)}
                onTouchEnd={() => setIsSigningActive(false)}
              >
                <SignatureCanvas
                  ref={signatureRef}
                  onOK={handleSignature}
                  webStyle={`.m-signature-pad {box-shadow: none; border: none;} .m-signature-pad--body {border: none;}`}
                />
              </View>
            </View>
          </>
        );

      case 4:
        return (
          <>
            <View style={sales_styles.totalCard}>
              <Text style={sales_styles.totalLabel}>Monto total</Text>
              <Text style={sales_styles.totalAmount}>400.000,00 COP</Text>
            </View>

            <View style={sales_styles.paymentsHeader}>
              <Text style={sales_styles.paymentsTitle}>Pagos</Text>
              <TouchableOpacity onPress={addPayment} style={sales_styles.addPaymentButton}>
                <Feather name="plus" size={20} color="#232323" />
              </TouchableOpacity>
            </View>

            {payments.map((payment, index) => (
              <View key={index} style={sales_styles.paymentCard}>
                <View style={sales_styles.row}>
                  <Select
                    placeholder="Método de pago"
                    options={[
                      { label: 'Pago movil', value: 'pago_movil' },
                      { label: 'Zinli', value: 'zinli' },
                      { label: 'Mercantil', value: 'mercantil' },
                      { label: 'Link de Pago', value: 'link' },
                    ]}
                    value={payment.method}
                    onChange={(value) => {
                      const newPayments = [...payments];
                      newPayments[index].method = value;
                      setPayments(newPayments);
                    }}
                    containerStyle={sales_styles.halfField}
                  />
                  <Input
                    value={payment.amount}
                    onChangeText={(value) => {
                      const newPayments = [...payments];
                      newPayments[index].amount = value;
                      setPayments(newPayments);
                    }}
                    placeholder="Monto"
                    keyboardType="numeric"
                    containerStyle={sales_styles.halfField}
                  />
                </View>
                <Input
                  value={payment.reference}
                  onChangeText={(value) => {
                    const newPayments = [...payments];
                    newPayments[index].reference = value;
                    setPayments(newPayments);
                  }}
                  placeholder="Referencia"
                />
                {payments.length > 1 && (
                  <TouchableOpacity 
                    style={sales_styles.removeButton}
                    onPress={() => removePayment(index)}
                  >
                    <Feather name="x" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={sales_styles.shareButton}>
              <Feather name="share-2" size={20} color="#FFFFFF" />
              <Text style={sales_styles.shareButtonText}>Compartir</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      {showSuccess ? (
        <View style={sales_styles.successContainer}>
          <View style={sales_styles.successCard}>
            <View style={sales_styles.successIcon}>
              <Feather name="file-text" size={48} color="#0FE58B" />
            </View>
            
            <Text style={sales_styles.successTitle}>¡Felicitaciones!</Text>
            <Text style={sales_styles.successDescription}>
              El equipo de ventas esta revisando el contrato
            </Text>

            <View style={sales_styles.successDivider}>
              <Text style={sales_styles.totalPaidLabel}>Total pagado</Text>
              <Text style={sales_styles.totalPaidAmount}>400.000,00 COP</Text>
            </View>

            <View style={sales_styles.successDetails}>
              <Text style={sales_styles.successName}>ANA CARDOZO</Text>
              
              <View style={sales_styles.detailRow}>
                <Text style={sales_styles.detailLabel}>Transacción ID</Text>
                <Text style={sales_styles.detailValue}>2435GASFD7523</Text>
              </View>
              
              <View style={sales_styles.detailRow}>
                <Text style={sales_styles.detailLabel}>Fecha</Text>
                <Text style={sales_styles.detailValue}>11/11/2025</Text>
              </View>
              
              <View style={sales_styles.detailRow}>
                <Text style={sales_styles.detailLabel}>Hora</Text>
                <Text style={sales_styles.detailValue}>12:00:00</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={sales_styles.backButton2}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={sales_styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
      <View style={sales_styles.container}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#0C352E' }}>
          <View style={sales_styles.header}>
            <TouchableOpacity 
              style={sales_styles.backButton}
              onPress={() => {
                if (step === 1) {
                  router.back();
                } else {
                  setStep(step - 1);
                }
              }}
            >
              <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={sales_styles.stepIndicatorContainer}>
              <Svg width={72} height={72}>
                <SvgCircle
                  cx={36}
                  cy={36}
                  r={radius}
                  stroke="#FFFFFF"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <SvgCircle
                  cx={36}
                  cy={36}
                  r={radius}
                  stroke="#87BFB5"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="36, 36"
                />
              </Svg>
              <View style={sales_styles.stepIconContainer}>
                <Feather name={getStepIcon()} size={23} color="#FFFFFF" />
              </View>
              <Text style={sales_styles.stepNumber}>{stepDisplay.current}/{stepDisplay.total}</Text>
            </View>
            
            <View style={sales_styles.headerTextContainer}>
              <Text style={sales_styles.headerTitle}>{getStepTitle()}</Text>
              <Text style={sales_styles.headerSubtitle}>{getStepSubtitle()}</Text>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView 
          style={sales_styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={!isSigningActive}
        >
          <View style={sales_styles.form}>
            {renderStepContent()}
          </View>
        </ScrollView>

        <View style={sales_styles.buttonContainer}>
          <TouchableOpacity 
            style={sales_styles.nextButton}
            onPress={() => {
              if (step < totalSteps) {
                setStep(step + 1);
              } else {
                setShowSuccess(true);
              }
            }}
          >
            <Text style={sales_styles.nextButtonText}>
              {step === totalSteps ? 'Finalizar' : 'Siguiente'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      )}
    </>
  );
}
