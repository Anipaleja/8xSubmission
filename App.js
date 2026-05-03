import React from "react";
import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import CampaignListScreen from "./src/screens/CampaignListScreen";
import CampaignDetailScreen from "./src/screens/CampaignDetailScreen";
import SubmitVideoScreen from "./src/screens/SubmitVideoScreen";
import SubmissionsScreen from "./src/screens/SubmissionsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="CampaignList"
        screenOptions={{
          headerStyle: { backgroundColor: "#0A0A0A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700", fontSize: 17 },
          contentStyle: { backgroundColor: "#F7F4EE" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="CampaignList"
          component={CampaignListScreen}
          options={{ title: "Active Campaigns", headerShown: false }}
        />
        <Stack.Screen
          name="CampaignDetail"
          component={CampaignDetailScreen}
          options={({ route }) => ({
            title: route.params?.brand || "Campaign",
            headerTransparent: false,
          })}
        />
        <Stack.Screen
          name="SubmitVideo"
          component={SubmitVideoScreen}
          options={{ title: "Submit Video", presentation: "modal" }}
        />
        <Stack.Screen
          name="Submissions"
          component={SubmissionsScreen}
          options={{ title: "My Submissions" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent("main", () => App);
