import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cows"
        options={{
          title: "Cows",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="leaf.fill" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.fill" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
  name="chat"
  options={{
    title: "Chat",
    tabBarIcon: ({ color }) => (
      <IconSymbol name="mic.fill" size={26} color={color} />
    ),
  }}
/>

    </Tabs>
  );
}
