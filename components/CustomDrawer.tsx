import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
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
import { getChats } from "../utils/Chat"; // Adjust the import path accordingly

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const auth = getAuth(app);
  const user = auth.currentUser; // Get the current user
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      const fetchedChats = await getChats();
      setChats(fetchedChats);
    };

    fetchChats();
  }, []);

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

  // Header component for FlatList
  const renderHeader = () => (
    <View>
      <Logo />
      <TouchableOpacity
        style={[
          styles.communityButton,
          isHomeScreen && styles.activeButton, // Apply active style if on Home screen
        ]}
        onPress={() => navigation.navigate("Home")}
      >
        <Icon name="chat" type="material" color="#fff" size={24} />
        <Text style={styles.communityButtonText}>New Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.communityButton,
          isCommunityScreen && styles.activeButton, // Apply active style if on Community screen
        ]}
        onPress={() => navigation.navigate("CommunityScreen")}
      >
        <Icon name="people" type="material" color="#fff" size={24} />
        <Text style={styles.communityButtonText}>Community</Text>
      </TouchableOpacity>
      {/* <View style={styles.sectionTitleContainer}>
        <Icon name="auto-awesome" type="material" color="#FFD700" size={16} />
      </View> */}
      <View
        style={[
          { borderBottomColor: "#444", borderBottomWidth: 1.5, marginVertical: 16 },
        ]}
      ></View>
    </View>
  );

  const renderFooter = () => (
    <View>
      <DrawerItemList {...props} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => {
          console.log("Current Route:", currentRoute);
          const isActive = activeChatId === item.id && currentRoute === "ChatScreen";
          return (
            <TouchableOpacity
              style={[
                styles.chatItemButton,
                isActive ? styles.activeChatItem : null,
              ]}
              onPress={() => {
                setActiveChatId(item.id); 
                navigation.navigate("ChatScreen", { chatId: item.id, carDetails: item.carDetails }); 
              }}
            >
              <Text style={styles.chatText}>{item.carDetails}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* User Profile Section */}
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => navigation.navigate("UserScreen")}
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
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "#1a1c1b",
  },
  // Community Button Styles
  communityButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,

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
  // Chat Item Styles
  chatItemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    
  },
  activeChatItem: {
    backgroundColor: "#2a2e2e", // Default background color
  },
  chatText: {
    fontFamily: "Aeonik",
    fontSize: 16,
    color: "#fff",
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
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#95ff77",
    fontFamily: "Aeonik",
  },
});

export default CustomDrawer;
