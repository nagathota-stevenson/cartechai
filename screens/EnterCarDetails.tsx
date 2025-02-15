import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, useWindowDimensions } from 'react-native';
import CustomButton from '@/components/Button';
import { useNavigation } from '@react-navigation/native';
import Logo from '@/components/ui/Logo';
import { Icon } from 'react-native-elements';

export default function EnterCarDetailsScreen() {
  const navigation = useNavigation();
  const width =useWindowDimensions().width * 0.9;
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: 50 }]}>
      <Logo />
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                 <Icon name="edit-note" iconStyle={{fontSize: 40, color: "#fff", paddingBottom: 10, paddingRight: 8 }}  />
                <Text style={styles.title}>Enter Car Details</Text>
            </View> */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {Object.keys(carDetails).map((key) => (
        <TextInput
          key={key}
          style={[styles.input, { width: width }]}
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
        disabled={!isAnyFieldFilled()} 
      />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    height  : '100%',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
  },
  chatButton:{
    alignSelf: 'center',
  },
  subtitle: {
    fontFamily: 'Aeonik',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Aeonik',
    color: '#fff',
    textAlign: 'center',
    
    marginBottom: 16,
  },
  input: {
    alignSelf: 'center',
    fontSize: 16,
    backgroundColor: '#222',
    color: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 32,
    fontFamily: "Aeonik"
  },
 
});


