import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";
import app from "../config/firebaseConfig";
import Logo from "./ui/Logo";

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <View style={styles.container}>
      <Logo />
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" color="#fff" size={22} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </View>
      
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawer:{
    alignContent: "flex-start",
    backgroundColor: "#1a1c1b",
  },
  container:{
    alignContent: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#1a1c1b",
  },
  header: {
    paddingLeft: 16,
    backgroundColor: "#1a1c1b",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#d9534f",
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
});

export default CustomDrawer;
