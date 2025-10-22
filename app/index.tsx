import { Redirect } from 'expo-router';

// TODO: Aquí irá la lógica de autenticación
export default function AppIndex() {
  // Por ahora siempre redirige a auth
  const isAuthenticated = false;
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/auth/login" />;
}