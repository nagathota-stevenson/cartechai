import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createDrawerNavigator, DrawerToggleButton, useDrawerStatus } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import CarDetailsScreen from "../screens/CarDetailsScreen";
import ChatScreen from "@/screens/ChatScreen";
import EnterCarDetailsScreen from "@/screens/EnterCarDetails";
import LoginScreen from "@/screens/LoginScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../config/firebaseConfig";
import CustomDrawer from "@/components/CustomDrawer";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

const Drawer = createDrawerNavigator();
SplashScreen.preventAutoHideAsync();

// ✅ Function to wrap any screen with the drawer toggle button
const ScreenWithDrawer = ({ component: Component }) => {
  const isDrawerOpen = useDrawerStatus() === "open";

  return (
    <View style={styles.container}>
      {!isDrawerOpen && (
        <View style={styles.drawerButton}>
          <DrawerToggleButton tintColor="white" />
        </View>
      )}
      <Component />
    </View>
  );
};

const Layout = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  // ✅ Ensure all custom fonts are correctly loaded
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Arame: require("../assets/fonts/Arame-Regular.ttf"),
    Robit: require("../assets/fonts/robit.otf"),
    Aeonik: require("../assets/fonts/Aeonik-Regular.ttf"),
  });

  // ✅ Only hide the splash screen when fonts are fully loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ✅ Ensure authentication state is properly handled
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // ✅ Prevent rendering before fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationIndependentTree>
      {user ? (
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawer {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen name="Home">
            {() => <ScreenWithDrawer component={HomeScreen} />}
          </Drawer.Screen>
          <Drawer.Screen name="CarDetails">
            {() => <ScreenWithDrawer component={CarDetailsScreen} />}
          </Drawer.Screen>
          <Drawer.Screen name="ChatScreen">
            {() => <ScreenWithDrawer component={ChatScreen} />}
          </Drawer.Screen>
          <Drawer.Screen name="EnterCarDetails">
            {() => <ScreenWithDrawer component={EnterCarDetailsScreen} />}
          </Drawer.Screen>
        </Drawer.Navigator>
      ) : (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="Login" component={LoginScreen} />
        </Drawer.Navigator>
      )}
    </NavigationIndependentTree>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  drawerButton: {
    position: "absolute",
    top: 58, // Adjust position
    left: 8, // Adjust position
    zIndex: 100, // Ensure it's above other elements
  },
});

export default Layout;
