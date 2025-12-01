import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/Input';
import { register_styles } from './styles/register-styles';

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [docType, setDocType] = useState('V');
  const [docNumber, setDocNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('+58');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (step === 2) {
    return (
      <SafeAreaView style={register_styles.container} edges={['top', 'bottom']}>
        <View style={register_styles.scrollContent}>
          <View style={register_styles.card}>
            <View style={register_styles.successContainer}>
              <Image
                source={require('@/assets/images/icon-register-2.png')}
                style={register_styles.successIcon}
                resizeMode="contain"
              />
              <Text style={register_styles.successTitle}>¡Bienvenida, {firstName}!</Text>
              <Text style={register_styles.successMessage}>
                Tu cuenta ha sido creada.{'\n'}
                ¡Es hora de explorar todo lo que{'\n'}
                tenemos para ti!
              </Text>
            </View>
            <TouchableOpacity style={register_styles.button} onPress={() => router.push('/auth/login')}>
              <Text style={register_styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={register_styles.container} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={register_styles.scrollContent}
      >
        <View style={register_styles.card}>
          <Text style={register_styles.title}>Registrarse</Text>

          <View style={register_styles.form}>
            <Input
              label="Nombres"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ana"
            />

            <Input
              label="Apellidos"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Cardozo"
            />

            <Input
              label="Fecha de nacimiento"
              isDate
              dateValue={birthDate}
              onDateChange={setBirthDate}
              placeholder="DD/MM/AAAA"
              rightIcon={<Feather name="calendar" size={20} color="#D7D9CF" />}
            />

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
              rightIcon={<Feather name="check" size={20} color="#0FE58B" />}
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
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="anapuki@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              rightIcon={<Feather name="check" size={20} color="#0FE58B" />}
            />

            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="************"
              secureTextEntry={!showPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#D7D9CF"
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity style={register_styles.button} onPress={() => setStep(2)}>
              <Text style={register_styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={register_styles.footer}>
          <Text style={register_styles.footerText}>¿Ya posee una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={register_styles.loginLink}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
