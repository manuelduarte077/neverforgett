import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { initQuickActions } from '@/services/quickActionsService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Initialize quick actions
  useEffect(() => {
    let cleanupFn: (() => void) | undefined;
    
    const setupQuickActions = async () => {
      cleanupFn = await initQuickActions();
    };
    
    setupQuickActions();
    
    return () => {
      if (cleanupFn && typeof cleanupFn === 'function') {
        cleanupFn();
      }
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add"
          options={{
            presentation: 'modal',
            headerShown: true, title: 'Agregar Suscripción',
          }} />
        <Stack.Screen name="settings"
          options={{
            presentation: 'modal',
            headerShown: true, title: 'Configuración',
          }} />
        <Stack.Screen name="subscription/[id]"
          options={{
            presentation: 'modal',
            headerShown: true, title: 'Suscripción',
          }} />
        <Stack.Screen name="edit-subscription/[id]"
          options={{
            presentation: 'modal',
            headerShown: true, title: 'Editar Suscripción',
          }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}