import { Redirect, Tabs, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import TabBarIcon from "../../src/components/TabBarIcon";
import useAuth from "../../src/hooks/useAuth";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function TabsLayout() {
  const { refreshUser } = useAuth();
  const user = useAuthStore((s) => s.user);

  useFocusEffect(
    useCallback(() => {
      if (user?.id && user.id !== "guest") {
        refreshUser();
      }
    }, [user?.id])
  );

  if (user?.role === "admin") {
    return <Redirect href="/admin" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Öğren",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Kaydedilenler",
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "İstatistik",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="bar-chart" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
