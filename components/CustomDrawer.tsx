import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../config/firebaseConfig";
import Logo from "./ui/Logo";

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const auth = getAuth(app);
  const user = auth.currentUser; // Get the current user

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(DrawerActions.closeDrawer());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Access the current route from props.state
  const currentRoute = props.state?.routes[props.state.index]?.name;

  // Check if the current route is the Community screen
  const isCommunityScreen = currentRoute === "CommunityScreen";
  const isHomeScreen = currentRoute === "Home";

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} style={styles.drawer}>
        <View style={styles.drawerContent}>
          <Logo />

          <TouchableOpacity
            style={[
              styles.communityButton,
              isHomeScreen && styles.activeButton, // Apply active style if on Community screen
            ]}
            onPress={() => navigation.navigate("Home")} // Navigate to Community screen
          >
            <Icon name="chat" type="material" color="#fff" size={24} />
            <Text style={styles.communityButtonText}>New Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.communityButton,
              isCommunityScreen && styles.activeButton, // Apply active style if on Community screen
            ]}
            onPress={() => navigation.navigate("CommunityScreen")} // Navigate to Community screen
          >
            <Icon name="people" type="material" color="#fff" size={24} />
            <Text style={styles.communityButtonText}>Community</Text>
          </TouchableOpacity>

          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* User Profile Section */}
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => navigation.navigate("UserScreen")} // Navigate to UserScreen
      >
        <Image
          source={{
            uri:
              user?.photoURL ||
              "https://avatar.iran.liara.run/public/boy?username=Ash",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>
          {user?.displayName || "Stevenson Nagathota"}
        </Text>
        <Icon name="more-horiz" type="material" color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1c1b",
  },
  drawer: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    marginTop: -20,
  },
  // Community Button Styles
  communityButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
  },
  activeButton: {
    backgroundColor: "#2a2e2e", // Background color when active
  },
  communityButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Aeonik",
    marginLeft: 12,
  },
  // Profile Section Styles
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    paddingBottom: 24,
    borderTopColor: "#444",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Aeonik",
    flex: 1,
  },
});

export default CustomDrawer;