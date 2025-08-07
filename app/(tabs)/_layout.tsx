import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSubscriptionState } from '@/hooks/useSubscriptionState';

export default function TabLayout() {
  const { hasSubscriptions, loading } = useSubscriptionState();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5E7',
          paddingBottom: 8,
          paddingTop: 6,
          height: 88,
          display: hasSubscriptions ? 'flex' : 'none',
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size }) => (
            <SymbolView name="house" style={{
              width: size,
              height: size,
              margin: 5,
            }} type="hierarchical" />
          ),
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'Suscripciones',
          tabBarIcon: ({ size }) => (
            <SymbolView name="creditcard" style={{
              width: size,
              height: size,
              margin: 5,
            }} type="hierarchical" />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ size }) => (
            <SymbolView name="chart.bar" style={{
              width: size,
              height: size,
              margin: 5,
            }} type="hierarchical" />
          ),
        }}
      />
    </Tabs>
  );
}