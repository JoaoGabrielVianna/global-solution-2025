import { Tabs } from 'expo-router';
import {
  Database,
  AlertTriangle,
  History,
  Shield,
  Home
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 75,
          shadowColor: COLORS.shadow,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
          shadowColor: COLORS.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 6,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          headerTitle: 'Global Solution 2025',
          tabBarIcon: ({ color, size, focused }) => (
            <Home size={size} color={color} strokeWidth={focused ? 3 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="environment-data"
        options={{
          title: 'Dados',
          headerTitle: 'Dados Ambientais',
          tabBarIcon: ({ color, size, focused }) => (
            <Database size={size} color={color} strokeWidth={focused ? 3 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="risk/view"
        options={{
          title: 'Riscos',
          headerTitle: 'Análise de Riscos',
          tabBarIcon: ({ color, size, focused }) => (
            <AlertTriangle size={size} color={color} strokeWidth={focused ? 3 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="risk/history"
        options={{
          title: 'Histórico',
          headerTitle: 'Histórico de Monitoramento',
          tabBarIcon: ({ color, size, focused }) => (
            <History size={size} color={color} strokeWidth={focused ? 3 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="risk/mitigation"
        options={{
          title: 'Ações',
          headerTitle: 'Ações de Mitigação',
          tabBarIcon: ({ color, size, focused }) => (
            <Shield size={size} color={color} strokeWidth={focused ? 3 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
