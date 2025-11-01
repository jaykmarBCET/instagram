import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome"

export default function TabLayout() {

    return <Tabs
        screenOptions={{
            tabBarActiveTintColor: "blue",
            tabBarShowLabel: false
        }}
    >
        <Tabs.Screen
            name="index"
            options={{
                title: "For You",
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />
            }} />
        <Tabs.Screen
            name="new"
            options={{
                title: "Create Post",
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus-square-o" color={color} />
            }} />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />
            }} />
    </Tabs>
} 