import { Button, Card, Input, Layout, Text } from '@presentation/components/ui';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Layout style={styles.container} level="1">
      <Card style={styles.card}>
        <Text variant="h4" style={styles.title}>
          Iniciar Sesión
        </Text>
        <Text variant="subtitle2" style={styles.subtitle}>
          Bienvenido a CoreSales
        </Text>
        
        <Input
          label="Email"
          placeholder="Ingresa tu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        
        <Input
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        
        <Button
          title="Iniciar Sesión"
          style={styles.button}
          onPress={() => console.log('Login pressed')}
        />
        
        <Layout style={styles.navigation} level="1">
          <Link href="/auth/register" asChild>
            <Button
              title="¿No tienes cuenta? Regístrate"
              variant="ghost"
              size="small"
            />
          </Link>
          
          <Link href="/auth/forgot-password" asChild>
            <Button
              title="¿Olvidaste tu contraseña?"
              variant="ghost"
              size="small"
            />
          </Link>
        </Layout>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
  },
  navigation: {
    alignItems: 'center',
    gap: 8,
  },
});