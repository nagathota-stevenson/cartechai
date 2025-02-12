import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';  // Import Lottie
import CustomButton from '@/components/Button';

export default function HomeScreen() {
  const [vin, setVin] = useState('');
  const navigation = useNavigation();

  const handleVinSubmission = () => {
    if (!vin.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid VIN.');
      return;
    }
    navigation.navigate('CarDetails', { vin });
  };

  const handleEnterCarDetails = () => { 
    navigation.navigate('EnterCarDetails');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}  horizontal={false}>
          {/* Lottie Animation */}
          <LottieView
            source={require('../assets/animations/ai.json')}  // Make sure the file path is correct
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>CarTechAI</Text>
          <Text style={styles.subtitle}>Please Enter Your VIN to Get Started</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter VIN (e.g., 1HGCM82633A123456)"
            value={vin}
            maxLength={17}
            onChangeText={setVin}
          />
           <Text style={styles.subtitle}>OR</Text>
           <CustomButton title="Enter Details Manually" icon="edit-note" backgroundColor='#ffffff' color='#1a1c1b' iconColor='#1a1c1b' onPress={handleEnterCarDetails} />
          <CustomButton title="Look Up" icon="search" onPress={handleVinSubmission} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'WorkSans',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,  // Adjust the margin for better spacing
  },
  title: {
    fontSize: 32,
    fontFamily: 'WorkSans',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontFamily: 'WorkSans',
    fontSize: 16,
    color: '#555D58',
    textAlign: 'center',
  },
  input: {
    fontFamily: 'WorkSans',
    padding: 16,
    fontSize: 16,
    borderRadius: 32,
    marginTop: 16,
    width: 350,
    marginBottom: 8,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
});
