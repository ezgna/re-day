// import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  return (
    <NativeTabs
    // screenOptions={{
    //   headerShown: false,
    //   tabBarShowLabel: false,
    //   tabBarIconStyle: { marginTop: 4 },
    //   tabBarActiveTintColor: "#007AFF",
    //   tabBarInactiveTintColor: "#8E8E93",
    //   tabBarButton: (props) => {
    //     const { ref, ...rest } = props;
    //     return (
    //       <Pressable {...rest} android_ripple={{ color: "transparent" }}>
    //         {props.children}
    //       </Pressable>
    //     );
    //   },
    // }}
    >
      <NativeTabs.Trigger name="index">
        <Label>Reflect</Label>
        <Icon sf={'book'} drawable="ic_menu_mylocation" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendarview">
        <Label>Calendar</Label>
        <Icon sf={"calendar"} drawable="ic_menu_my_calendar" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf={"gear"} drawable="ic_menu_my_manage" />
      </NativeTabs.Trigger>
      {/* <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="pencil-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendarview"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      /> */}
    </NativeTabs>
  );
}
