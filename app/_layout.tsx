import { useFonts } from 'expo-font';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [vin, setVin] = useState('');
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const handleVinSubmission = () => {
    // Handle VIN or number plate scan logic here
    alert(`Submitted VIN/Plate: ${vin}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CarTechAI</Text>
      <Text style={styles.subtitle}>Enter VIN or Scan Number Plate</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter VIN or Plate Number"
        value={vin}
        onChangeText={setVin}
      />
      <Button title="Submit" onPress={handleVinSubmission} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceMono',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    width: '80%',
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
});