import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';

const API_KEY = 'c9RQzWCF+BlciN0BYvAV6Q==SmJ714Ysl1kG6yok';

export default function HomeScreen() {
  const [vin, setVin] = useState('');
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVinSubmission = async () => {
    if (!vin.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid VIN.');
      return;
    }

    setLoading(true);
    setCarDetails(null);

    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/vinlookup?vin=${vin}`, {
        headers: { 'X-Api-Key': API_KEY },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data.');
      }

      const data = await response.json();
      setCarDetails(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch car details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LottieView
        source={require('../assets/animations/ai.json')}
        autoPlay
        loop
        style={styles.animation}
        />
        <Text style={styles.title}>CarTechAI</Text>
        <Text style={styles.subtitle}>Enter VIN or Scan Number Plate</Text>
        <TextInput
        style={styles.input}
        placeholder="Enter VIN"
        value={vin}
        onChangeText={setVin}
        />
        <Button title="Submit" onPress={handleVinSubmission} />

        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}

        {carDetails && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Car Details:</Text>
          {Object.entries(carDetails).map(([key, value]) => (
          <Text key={key} style={styles.resultText}>
            {`${key}: ${value}`}
          </Text>
          ))}
        </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    padding: 16,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceMono',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    width: '90%',
  },
  resultTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    color: '#ccc',
  },
});
