import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, GestureResponderEvent } from 'react-native';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/Button';

interface CarDetails {
  Make: string;
  Model: string;
  ModelYear: string;
  Trim: string;
  BodyClass: string;
  DriveType: string;
  EngineCylinders: string;
  FuelTypePrimary: string;
  GVWR: string;
  TransmissionStyle: string;
  VIN: string;
  ManufacturerName: string;
  PlantCity: string;
  PlantCountry: string;
  PlantState: string;
  VehicleType: string;
  DisplacementL: string;
  EngineConfiguration: string;
  FuelDeliveryType: string;
  SeatBeltsType: string;
  AirBagLocations: string;
  ErrorCode: string;
  ErrorText: string;
  SuggestedVIN: string;
  PossibleValues: string;
  AdditionalErrorText: string;
  VehicleDescriptor: string;
  DestinationMarket: string;
  Series: string;
  PlantCompanyName: string;
  Trim2: string;
  Series2: string;
  Note: string;
  BasePrice: string;
  NonLandUse: string;
  Doors: string;
  Windows: string;
  WheelBaseType: string;
  TrackWidth: string;
  GrossVehicleWeightRatingFrom: string;
  BedLength: string;
  CurbWeight: string;
  WheelBaseFrom: string;
  WheelBaseTo: string;
  GrossCombinationWeightRatingFrom: string;
  GrossCombinationWeightRatingTo: string;
  GrossVehicleWeightRatingTo: string;
  BedType: string;
  CabType: string;
  TrailerTypeConnection: string;
  TrailerBodyType: string;
  TrailerLength: string;
  OtherTrailerInfo: string;
  NumberOfWheels: string;
  WheelSizeFront: string;
  WheelSizeRear: string;
  EntertainmentSystem: string;
  SteeringLocation: string;
  NumberOfSeats: string;
  NumberOfSeatRows: string;
  TransmissionSpeeds: string;
  Axles: string;
  AxleConfiguration: string;
  BrakeSystemType: string;
  BrakeSystemDescription: string;
  OtherBatteryInfo: string;
  BatteryType: string;
  NumberOfBatteryCellsPerModule: string;
  BatteryCurrentFrom: string;
  BatteryVoltageFrom: string;
  BatteryEnergyFrom: string;
  EVDriveUnit: string;
  BatteryCurrentTo: string;
  BatteryVoltageTo: string;
  BatteryEnergyTo: string;
  NumberOfBatteryModulesPerPack: string;
  NumberOfBatteryPacksPerVehicle: string;
  ChargerLevel: string;
  ChargerPower: string;
  DisplacementCC: string;
  DisplacementCI: string;
  EngineStrokeCycles: string;
  EngineModel: string;
  EnginePower: string;
  ValveTrainDesign: string;
  FuelTypeSecondary: string;
  EngineBrakeFrom: string;
  CoolingType: string;
  EngineBrakeTo: string;
  ElectrificationLevel: string;
  OtherEngineInfo: string;
  Turbo: string;
  TopSpeed: string;
  EngineManufacturer: string;
  Pretensioner: string;
  OtherRestraintSystemInfo: string;
  CurtainAirBagLocations: string;
  SeatCushionAirBagLocations: string;
  FrontAirBagLocations: string;
  KneeAirBagLocations: string;
  SideAirBagLocations: string;
  AntiLockBrakingSystem: string;
  ElectronicStabilityControl: string;
  TractionControl: string;
  TirePressureMonitoringSystemType: string;
  ActiveSafetySystemNote: string;
  AutoReverseSystem: string;
  AutomaticPedestrianAlertingSound: string;
  EventDataRecorder: string;
  KeylessIgnition: string;
  SAEAutomationLevelFrom: string;
  SAEAutomationLevelTo: string;
  AdaptiveCruiseControl: string;
  CrashImminentBraking: string;
  BlindSpotWarning: string;
  ForwardCollisionWarning: string;
  LaneDepartureWarning: string;
  LaneKeepingAssistance: string;
  BackupCamera: string;
  ParkingAssist: string;
  BusLength: string;
  BusFloorConfigurationType: string;
  BusType: string;
  OtherBusInfo: string;
  CustomMotorcycleType: string;
  MotorcycleSuspensionType: string;
  MotorcycleChassisType: string;
  OtherMotorcycleInfo: string;
  DynamicBrakeSupport: string;
  PedestrianAutomaticEmergencyBraking: string;
  AutomaticCrashNotification: string;
  DaytimeRunningLight: string;
  HeadlampLightSource: string;
  SemiautomaticHeadlampBeamSwitching: string;
  AdaptiveDrivingBeam: string;
  RearCrossTrafficAlert: string;
  RearAutomaticEmergencyBraking: string;
  BlindSpotIntervention: string;
  LaneCenteringAssistance: string;
}

export default function HomeScreen() {
  const [vin, setVin] = useState('');
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVinSubmission = async () => {
    if (!vin.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid VIN.');
      return;
    }
  
    setLoading(true);
    setCarDetails(null);
  
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch data.');
      }
  
      const data = await response.json();
  
      if (data && data.Results && data.Results.length > 0) {
        const results = data.Results;
  
        // Create a mapping of Variable to Value
        const carDetailsMap: { [key: string]: string } = {};
        results.forEach((item: { Variable: string; Value: string | null }) => {
          if (item.Value !== null) {
            carDetailsMap[item.Variable] = item.Value;
          }
        });
  
        // Map the API response to the CarDetails interface
        const carDetails: CarDetails = {
          Make: carDetailsMap["Make"] || "",
          Model: carDetailsMap["Model"] || "",
          ModelYear: carDetailsMap["Model Year"] || "",
          Trim: carDetailsMap["Trim"] || "",
          BodyClass: carDetailsMap["Body Class"] || "",
          DriveType: carDetailsMap["Drive Type"] || "",
          EngineCylinders: carDetailsMap["Engine Number of Cylinders"] || "",
          FuelTypePrimary: carDetailsMap["Fuel Type - Primary"] || "",
          GVWR: carDetailsMap["Gross Vehicle Weight Rating To"] || "",
          TransmissionStyle: carDetailsMap["Transmission Style"] || "",
          VIN: carDetailsMap["VIN"] || "",
          ManufacturerName: carDetailsMap["Manufacturer Name"] || "",
          PlantCity: carDetailsMap["Plant City"] || "",
          PlantCountry: carDetailsMap["Plant Country"] || "",
          PlantState: carDetailsMap["Plant State"] || "",
          VehicleType: carDetailsMap["Vehicle Type"] || "",
          DisplacementL: carDetailsMap["Displacement (L)"] || "",
          EngineConfiguration: carDetailsMap["Engine Configuration"] || "",
          FuelDeliveryType: carDetailsMap["Fuel Delivery / Fuel Injection Type"] || "",
          SeatBeltsType: carDetailsMap["Seat Belt Type"] || "",
          AirBagLocations: carDetailsMap["Front Air Bag Locations"] || "",
          ErrorCode: carDetailsMap["Error Code"] || "",
          ErrorText: carDetailsMap["Error Text"] || "",
          SuggestedVIN: carDetailsMap["Suggested VIN"] || "",
          PossibleValues: carDetailsMap["Possible Values"] || "",
          AdditionalErrorText: carDetailsMap["Additional Error Text"] || "",
          VehicleDescriptor: carDetailsMap["Vehicle Descriptor"] || "",
          DestinationMarket: carDetailsMap["Destination Market"] || "",
          Series: carDetailsMap["Series"] || "",
          PlantCompanyName: carDetailsMap["Plant Company Name"] || "",
          Trim2: carDetailsMap["Trim2"] || "",
          Series2: carDetailsMap["Series2"] || "",
          Note: carDetailsMap["Note"] || "",
          BasePrice: carDetailsMap["Base Price ($)"] || "",
          NonLandUse: carDetailsMap["Non-Land Use"] || "",
          Doors: carDetailsMap["Doors"] || "",
          Windows: carDetailsMap["Windows"] || "",
          WheelBaseType: carDetailsMap["Wheel Base Type"] || "",
          TrackWidth: carDetailsMap["Track Width (inches)"] || "",
          GrossVehicleWeightRatingFrom: carDetailsMap["Gross Vehicle Weight Rating From"] || "",
          BedLength: carDetailsMap["Bed Length (inches)"] || "",
          CurbWeight: carDetailsMap["Curb Weight (pounds)"] || "",
          WheelBaseFrom: carDetailsMap["Wheel Base (inches) From"] || "",
          WheelBaseTo: carDetailsMap["Wheel Base (inches) To"] || "",
          GrossCombinationWeightRatingFrom: carDetailsMap["Gross Combination Weight Rating From"] || "",
          GrossCombinationWeightRatingTo: carDetailsMap["Gross Combination Weight Rating To"] || "",
          GrossVehicleWeightRatingTo: carDetailsMap["Gross Vehicle Weight Rating To"] || "",
          BedType: carDetailsMap["Bed Type"] || "",
          CabType: carDetailsMap["Cab Type"] || "",
          TrailerTypeConnection: carDetailsMap["Trailer Type Connection"] || "",
          TrailerBodyType: carDetailsMap["Trailer Body Type"] || "",
          TrailerLength: carDetailsMap["Trailer Length (feet)"] || "",
          OtherTrailerInfo: carDetailsMap["Other Trailer Info"] || "",
          NumberOfWheels: carDetailsMap["Number of Wheels"] || "",
          WheelSizeFront: carDetailsMap["Wheel Size Front (inches)"] || "",
          WheelSizeRear: carDetailsMap["Wheel Size Rear (inches)"] || "",
          EntertainmentSystem: carDetailsMap["Entertainment System"] || "",
          SteeringLocation: carDetailsMap["Steering Location"] || "",
          NumberOfSeats: carDetailsMap["Number of Seats"] || "",
          NumberOfSeatRows: carDetailsMap["Number of Seat Rows"] || "",
          TransmissionSpeeds: carDetailsMap["Transmission Speeds"] || "",
          Axles: carDetailsMap["Axles"] || "",
          AxleConfiguration: carDetailsMap["Axle Configuration"] || "",
          BrakeSystemType: carDetailsMap["Brake System Type"] || "",
          BrakeSystemDescription: carDetailsMap["Brake System Description"] || "",
          OtherBatteryInfo: carDetailsMap["Other Battery Info"] || "",
          BatteryType: carDetailsMap["Battery Type"] || "",
          NumberOfBatteryCellsPerModule: carDetailsMap["Number of Battery Cells per Module"] || "",
          BatteryCurrentFrom: carDetailsMap["Battery Current (Amps) From"] || "",
          BatteryVoltageFrom: carDetailsMap["Battery Voltage (Volts) From"] || "",
          BatteryEnergyFrom: carDetailsMap["Battery Energy (kWh) From"] || "",
          EVDriveUnit: carDetailsMap["EV Drive Unit"] || "",
          BatteryCurrentTo: carDetailsMap["Battery Current (Amps) To"] || "",
          BatteryVoltageTo: carDetailsMap["Battery Voltage (Volts) To"] || "",
          BatteryEnergyTo: carDetailsMap["Battery Energy (kWh) To"] || "",
          NumberOfBatteryModulesPerPack: carDetailsMap["Number of Battery Modules per Pack"] || "",
          NumberOfBatteryPacksPerVehicle: carDetailsMap["Number of Battery Packs per Vehicle"] || "",
          ChargerLevel: carDetailsMap["Charger Level"] || "",
          ChargerPower: carDetailsMap["Charger Power (kW)"] || "",
          DisplacementCC: carDetailsMap["Displacement (CC)"] || "",
          DisplacementCI: carDetailsMap["Displacement (CI)"] || "",
          EngineStrokeCycles: carDetailsMap["Engine Stroke Cycles"] || "",
          EngineModel: carDetailsMap["Engine Model"] || "",
          EnginePower: carDetailsMap["Engine Power (kW)"] || "",
          ValveTrainDesign: carDetailsMap["Valve Train Design"] || "",
          FuelTypeSecondary: carDetailsMap["Fuel Type - Secondary"] || "",
          EngineBrakeFrom: carDetailsMap["Engine Brake (hp) From"] || "",
          CoolingType: carDetailsMap["Cooling Type"] || "",
          EngineBrakeTo: carDetailsMap["Engine Brake (hp) To"] || "",
          ElectrificationLevel: carDetailsMap["Electrification Level"] || "",
          OtherEngineInfo: carDetailsMap["Other Engine Info"] || "",
          Turbo: carDetailsMap["Turbo"] || "",
          TopSpeed: carDetailsMap["Top Speed (MPH)"] || "",
          EngineManufacturer: carDetailsMap["Engine Manufacturer"] || "",
          Pretensioner: carDetailsMap["Pretensioner"] || "",
          OtherRestraintSystemInfo: carDetailsMap["Other Restraint System Info"] || "",
          CurtainAirBagLocations: carDetailsMap["Curtain Air Bag Locations"] || "",
          SeatCushionAirBagLocations: carDetailsMap["Seat Cushion Air Bag Locations"] || "",
          FrontAirBagLocations: carDetailsMap["Front Air Bag Locations"] || "",
          KneeAirBagLocations: carDetailsMap["Knee Air Bag Locations"] || "",
          SideAirBagLocations: carDetailsMap["Side Air Bag Locations"] || "",
          AntiLockBrakingSystem: carDetailsMap["Anti-lock Braking System (ABS)"] || "",
          ElectronicStabilityControl: carDetailsMap["Electronic Stability Control (ESC)"] || "",
          TractionControl: carDetailsMap["Traction Control"] || "",
          TirePressureMonitoringSystemType: carDetailsMap["Tire Pressure Monitoring System (TPMS) Type"] || "",
          ActiveSafetySystemNote: carDetailsMap["Active Safety System Note"] || "",
          AutoReverseSystem: carDetailsMap["Auto-Reverse System for Windows and Sunroofs"] || "",
          AutomaticPedestrianAlertingSound: carDetailsMap["Automatic Pedestrian Alerting Sound (for Hybrid and EV only)"] || "",
          EventDataRecorder: carDetailsMap["Event Data Recorder (EDR)"] || "",
          KeylessIgnition: carDetailsMap["Keyless Ignition"] || "",
          SAEAutomationLevelFrom: carDetailsMap["SAE Automation Level From"] || "",
          SAEAutomationLevelTo: carDetailsMap["SAE Automation Level To"] || "",
          AdaptiveCruiseControl: carDetailsMap["Adaptive Cruise Control (ACC)"] || "",
          CrashImminentBraking: carDetailsMap["Crash Imminent Braking (CIB)"] || "",
          BlindSpotWarning: carDetailsMap["Blind Spot Warning (BSW)"] || "",
          ForwardCollisionWarning: carDetailsMap["Forward Collision Warning (FCW)"] || "",
          LaneDepartureWarning: carDetailsMap["Lane Departure Warning (LDW)"] || "",
          LaneKeepingAssistance: carDetailsMap["Lane Keeping Assistance (LKA)"] || "",
          BackupCamera: carDetailsMap["Backup Camera"] || "",
          ParkingAssist: carDetailsMap["Parking Assist"] || "",
          BusLength: carDetailsMap["Bus Length (feet)"] || "",
          BusFloorConfigurationType: carDetailsMap["Bus Floor Configuration Type"] || "",
          BusType: carDetailsMap["Bus Type"] || "",
          OtherBusInfo: carDetailsMap["Other Bus Info"] || "",
          CustomMotorcycleType: carDetailsMap["Custom Motorcycle Type"] || "",
          MotorcycleSuspensionType: carDetailsMap["Motorcycle Suspension Type"] || "",
          MotorcycleChassisType: carDetailsMap["Motorcycle Chassis Type"] || "",
          OtherMotorcycleInfo: carDetailsMap["Other Motorcycle Info"] || "",
          DynamicBrakeSupport: carDetailsMap["Dynamic Brake Support (DBS)"] || "",
          PedestrianAutomaticEmergencyBraking: carDetailsMap["Pedestrian Automatic Emergency Braking (PAEB)"] || "",
          AutomaticCrashNotification: carDetailsMap["Automatic Crash Notification (ACN) / Advanced Automatic Crash Notification (AACN)"] || "",
          DaytimeRunningLight: carDetailsMap["Daytime Running Light (DRL)"] || "",
          HeadlampLightSource: carDetailsMap["Headlamp Light Source"] || "",
          SemiautomaticHeadlampBeamSwitching: carDetailsMap["Semiautomatic Headlamp Beam Switching"] || "",
          AdaptiveDrivingBeam: carDetailsMap["Adaptive Driving Beam (ADB)"] || "",
          RearCrossTrafficAlert: carDetailsMap["Rear Cross Traffic Alert"] || "",
          RearAutomaticEmergencyBraking: carDetailsMap["Rear Automatic Emergency Braking"] || "",
          BlindSpotIntervention: carDetailsMap["Blind Spot Intervention (BSI)"] || "",
          LaneCenteringAssistance: carDetailsMap["Lane Centering Assistance"] || "",
        };
        setCarDetails(carDetails);
      } else {
        throw new Error('No details found for this VIN.');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch car details.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (carDetails) {
      console.log('Car Details:', carDetails);

      const {
        Make,
        Model,
        ModelYear,
        BodyClass,
        FuelTypePrimary
      } = carDetails;
  
      console.log('Make:', Make);
      console.log('Model:', Model);
      console.log('Model Year:', ModelYear);
      console.log('Body Class:', BodyClass);
      console.log('Fuel Type:', FuelTypePrimary);
    }
  }, [carDetails]);
  

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
          <Text style={styles.subtitle}>or</Text>
          <CustomButton
            title={'Scan Number Plate'}
            icon='camera-alt'
            onPress={function (event: GestureResponderEvent): void {
              throw new Error('Function not implemented.');
            }}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleVinSubmission}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}

          {carDetails && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Car Details:</Text>
              <Text style={styles.resultText}>Make: {carDetails.Make}</Text>
              <Text style={styles.resultText}>Model: {carDetails.Model}</Text>
              <Text style={styles.resultText}>Year: {carDetails.ModelYear}</Text>
              <Text style={styles.resultText}>Trim: {carDetails.Trim}</Text>
              <Text style={styles.resultText}>Body Class: {carDetails.BodyClass}</Text>
              <Text style={styles.resultText}>Drive Type: {carDetails.DriveType}</Text>
              <Text style={styles.resultText}>Engine Cylinders: {carDetails.EngineCylinders}</Text>
              <Text style={styles.resultText}>Fuel Type: {carDetails.FuelTypePrimary}</Text>
              <Text style={styles.resultText}>GVWR: {carDetails.GVWR}</Text>
              <Text style={styles.resultText}>Transmission Style: {carDetails.TransmissionStyle}</Text>
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
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    width: '90%',
    marginBottom: 16,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#1f78b4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
