import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function TabLayout() {
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
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
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
          tabBarIcon: ({ size, color }) => (
            <SymbolView name="creditcard" style={{
              width: size,
              height: size,
              margin: 5,
            }} type="hierarchical" />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="add"
        options={{
          title: 'Agregar',
          tabBarIcon: ({ size, color }) => (
            <SymbolView name="plus" style={{
              width: size,
              height: size,
              margin: 5,
            }} type="hierarchical" />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ size, color }) => (
            <SymbolView name="chart.bar" style={{
              width: size,
              height: size,
              margin: 5,
            }} type="hierarchical" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ size, color }) => (
            <SymbolView name="gear" style={{
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