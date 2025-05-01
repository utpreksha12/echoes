// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Components/Login";
import SignupScreen from "./Components/Signup";
import MapScreen from "./Screens/MapScreen";
import HistoryExplorer from "./Components/HistoryExplorer";
import QuizScreen from "./Screens/Quiz";
import PlacesVisitedScreen from "./Screens/PlacesVisited";
import LeaderboardScreen from "./Screens/LeaderBoard";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HistoryExplorer"
          component={HistoryExplorer}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        {
          <>
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen
              name="PlacesVisited"
              component={PlacesVisitedScreen}
            />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
