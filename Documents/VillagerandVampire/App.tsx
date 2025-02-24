import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./frontend/LoginScreen";
import RegisterScreen from "./frontend/RegisterScreen";
import HomeScreen from "./frontend/HomeScreen";
import GameScreen from "./frontend/GameScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen as React.FC} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen as React.FC} />
        <Stack.Screen name="Game" component={GameScreen as React.FC} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;