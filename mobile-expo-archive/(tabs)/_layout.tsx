import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#f5f5f5',
        tabBarStyle: { backgroundColor: '#16213e' },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#a0a0b0',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'System', tabBarLabel: 'System' }}
      />
      <Tabs.Screen
        name="lookup"
        options={{ title: 'Lookup', tabBarLabel: 'Lookup' }}
      />
      <Tabs.Screen
        name="phases"
        options={{ title: 'Phases', tabBarLabel: 'Phases' }}
      />
    </Tabs>
  );
}
