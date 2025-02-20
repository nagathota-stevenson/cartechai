import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import Logo from "@/components/ui/Logo";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (searchQuery = "") => {
    setLoading(true);
    const db = getFirestore();
    let q = collection(db, "community_posts");
  
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      q = query(
        q,
        where("title_lowercase", ">=", lowerCaseQuery),
        where("title_lowercase", "<=", lowerCaseQuery + "\uf8ff")
      );
    }
  
    try {
      const querySnapshot = await getDocs(q);
      const postList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postList);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
   
    fetchPosts(searchText.trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <Logo />
        </View>

        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => navigation.navigate("CreatePostScreen")}
        >
          <Icon name="add" type="material" color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Community Posts..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" type="material" color="#fff" size={22} />
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      {loading ? (
        <ActivityIndicator size="large" color="#95ff77" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postCard}
              onPress={() =>
                navigation.navigate("PostDetailsScreen", { postId: item.id })
              }
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.postStatus}>
                Status:{" "}
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1c1b",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center", // Center the logo
    alignItems: "center",
   
    marginTop: -8,
    position: "relative",
  },
  
  logoWrapper: {
    alignItems: "center", // Center the logo horizontally
  },
  newPostButton: {
    position: "absolute", // Position the button absolutely
    right: 0, // Align the button to the right
    padding: 6,
    backgroundColor: "#2a2e2e",
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2e2e",
    borderRadius: 16,
    paddingVertical: 6,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  postCard: {
    backgroundColor: "#2a2e2e",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  postDescription: {
    fontSize: 14,
    color: "#ddd",
    marginVertical: 5,
  },
  postStatus: {
    fontSize: 12,
    color: "#95ff77",
  },
});

export default CommunityScreen;
