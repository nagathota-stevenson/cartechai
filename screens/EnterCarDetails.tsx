import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import CustomButton from '@/components/Button';
import { useNavigation } from '@react-navigation/native';

export default function EnterCarDetailsScreen() {
  const navigation = useNavigation();
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    modelYear: '',
    fuelType: '',
    engineCylinders: '',
    engineDisplacement: '',
    vehicleType: '',
    trim: '',
    transmissionStyle: '',
    driveType: '',
    bodyClass: '',
    plantCity: '',
    plantCountry: '',
  });

  const handleChange = (field, value) => {
    setCarDetails({ ...carDetails, [field]: value });
  };

  const isAnyFieldFilled = () => {
    return Object.values(carDetails).some(value => value.trim() !== '');
  };

  const goToChat = () => {
    navigation.navigate('ChatScreen', { carDetails });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
      <Text style={styles.title}>Enter Car Details</Text>
      <Text style={styles.subtitle}>Please Provide Details for Better Assistance</Text>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {Object.keys(carDetails).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, (char) => char.toUpperCase())} 
          placeholderTextColor="#aaa"
          value={carDetails[key]}
          onChangeText={(text) => handleChange(key, text)}
        />
        ))}
      </ScrollView>

      <CustomButton
        title="Chat"
        icon="chat"
        onPress={goToChat}
        style={styles.chatButton}
        disabled={!isAnyFieldFilled()} // Disable button if no fields are filled
      />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
  },
  subtitle: {
    fontFamily: 'WorkSans',
    fontSize: 16,
    color: '#555D58',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'WorkSans',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    backgroundColor: '#222',
    color: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 32,
  },
  chatButton: {
    marginTop: 20,
    marginBottom: 200,
  },
});


