import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/Input';
import { forgot_password_styles } from './styles/forgot-password-styles';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const codeInputs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }
  };

  // Step 4: Success
  if (step === 4) {
    return (
      <SafeAreaView style={forgot_password_styles.container} edges={['top', 'bottom']}>
        <TouchableOpacity 
          style={forgot_password_styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={forgot_password_styles.content}>
          <View style={forgot_password_styles.card}>
            <View style={forgot_password_styles.iconContainer}>
              <Image
                source={require('@/assets/images/icon-step-4.png')}
                style={forgot_password_styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={forgot_password_styles.title}>¡Todo listo!</Text>
            <Text style={forgot_password_styles.successMessage}>
              Tu contraseña ha sido cambiada{'\n'}exitosamente.
            </Text>
            <TouchableOpacity 
              style={forgot_password_styles.button}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={forgot_password_styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 3: New password
  if (step === 3) {
    return (
      <SafeAreaView style={forgot_password_styles.container} edges={['top', 'bottom']}>
        <TouchableOpacity 
          style={forgot_password_styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={forgot_password_styles.content}>
          <View style={forgot_password_styles.card}>
            <View style={forgot_password_styles.iconContainer}>
              <Image
                source={require('@/assets/images/icon-step-3.png')}
                style={forgot_password_styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={forgot_password_styles.title}>Establece tu nueva contraseña</Text>
            <Text style={forgot_password_styles.description}>
              Elige una contraseña segura que no{'\n'}hayas usado antes.
            </Text>

            <View style={{ width: '100%' }}>
              <Input
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="****************"
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

              <Input
                label="Repetir contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="****************"
                secureTextEntry={!showConfirmPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#D7D9CF" 
                    />
                  </TouchableOpacity>
                }
              />
            </View>

            <TouchableOpacity 
              style={forgot_password_styles.button}
              onPress={() => setStep(4)}
            >
              <Text style={forgot_password_styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2: Verification code
  if (step === 2) {
    return (
      <SafeAreaView style={forgot_password_styles.container} edges={['top', 'bottom']}>
        <TouchableOpacity 
          style={forgot_password_styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={forgot_password_styles.content}>
          <View style={forgot_password_styles.card}>
            <View style={forgot_password_styles.iconContainer}>
              <Image
                source={require('@/assets/images/forgot-icon2.png')}
                style={forgot_password_styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={forgot_password_styles.title}>Introduce el código de verificación</Text>
            <Text style={forgot_password_styles.description}>
              Te enviamos un código de 6 dígitos a{'\n'}tu correo electrónico.
            </Text>

            <View style={forgot_password_styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { codeInputs.current[index] = ref; }}
                  style={forgot_password_styles.codeInput}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              ))}
            </View>

            <Text style={forgot_password_styles.resendText}>Reenviar el código 00:30</Text>

            <TouchableOpacity 
              style={forgot_password_styles.button}
              onPress={() => setStep(3)}
            >
              <Text style={forgot_password_styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={forgot_password_styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity 
        style={forgot_password_styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="keyboard-arrow-left" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={forgot_password_styles.content}>
        <View style={forgot_password_styles.card}>
          <View style={forgot_password_styles.iconContainer}>
            <Image
              source={require('@/assets/images/forgot-icon-1.png')}
              style={forgot_password_styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={forgot_password_styles.title}>¿Contraseña olvidada?</Text>
          <Text style={forgot_password_styles.description}>
            Introduce tu correo electrónico para{'\n'}recibir un código de recuperación.
          </Text>

          <View style={{ width: '100%' }}>
            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="anapuki@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              rightIcon={<Feather name="mail" size={20} color="#D7D9CF" />}
            />
          </View>

          <TouchableOpacity 
            style={forgot_password_styles.button}
            onPress={() => setStep(2)}
          >
            <Text style={forgot_password_styles.buttonText}>Restablecer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
