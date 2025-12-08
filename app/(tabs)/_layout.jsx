import { Tabs } from "expo-router";
import TabBarIcon from "../../src/components/TabBarIcon";

export default function TabsLayout() {
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
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
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
