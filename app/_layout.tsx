import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';  // Import NavigationContainer
import { createStackNavigator } from '@react-navigation/stack';  // Import createStackNavigator
import HomeScreen from '../screens/HomeScreen';  // Import your HomeScreen
import CarDetailsScreen from '../screens/CarDetailsScreen';  // Import the CarDetailsScreen
import ChatScreen from '@/screens/ChatScreen';
import EnterCarDetailsScreen from '@/screens/EnterCarDetails';
import LoginScreen from '@/screens/LoginScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();  // Initialize the stack navigator

export default function Layout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Arame: require('../assets/fonts/Arame-Regular.ttf'),
    Robit: require('../assets/fonts/robit.otf'),
    Aeonik: require('../assets/fonts/Aeonik-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;  // Don't render anything until fonts are loaded
  }

  return (
    <NavigationIndependentTree>
      <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
          opacity: current.progress,
          },
        };
        },
      }}
      >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
      />
      <Stack.Screen 
        name="CarDetails" 
        component={CarDetailsScreen} 
      />
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen} 
      />
       <Stack.Screen 
        name="EnterCarDetails" 
        component={EnterCarDetailsScreen} 
      />
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}
