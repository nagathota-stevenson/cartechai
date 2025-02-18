import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { auth } from "../config/firebaseConfig";
import Logo from "@/components/ui/Logo";

const PostDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  const db = getFirestore();

  const [post, setPost] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    fetchPostDetails();
    fetchResponses();
  }, []);

  const fetchPostDetails = async () => {
    try {
      const docRef = doc(db, "community_posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert("Error", "Post not found.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "community_responses"));
      const responseList = querySnapshot.docs
        .filter((doc) => doc.data().post_id === postId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      // Sort responses by votes (highest first)
      responseList.sort((a, b) => (b.votes || 0) - (a.votes || 0));

      setResponses(responseList);
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };

  const handleAddResponse = async () => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "community_responses"), {
        post_id: postId,
        user_id: user.uid,
        message: responseText,
        created_at: new Date().toISOString(),
        is_accepted: false,
        votes: 0, // Default vote count
      });
      setResponseText("");
      fetchResponses();
    } catch (error) {
      console.error("Error adding response:", error);
      Alert.alert("Error", "Could not add response.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptResponse = async (responseId) => {
    if (!post || post.user_id !== user.uid) return;
    try {
      await updateDoc(doc(db, "community_responses", responseId), { is_accepted: true });
      await updateDoc(doc(db, "community_posts", postId), { status: "closed" });
      fetchResponses();
      fetchPostDetails();
      Alert.alert("Success", "Response accepted and post closed.");
    } catch (error) {
      console.error("Error accepting response:", error);
    }
  };

  const handleVote = async (responseId, type) => {
    try {
      const responseRef = doc(db, "community_responses", responseId);
      await updateDoc(responseRef, { votes: increment(type === "upvote" ? 1 : -1) });
      fetchResponses();
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#95ff77" style={styles.loader} />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" type="material" color="#fff" size={24} />
        </TouchableOpacity>
        <Logo />
      </View>

      {/* Post Details */}
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{post?.title}</Text>
        <Text style={styles.postDescription}>{post?.description}</Text>
        <Text style={styles.postStatus}>
          Status: {post?.status.charAt(0).toUpperCase() + post?.status.slice(1)}
        </Text>
      </View>

      {/* Responses List */}
      <FlatList
        data={responses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.responseCard, item.is_accepted && styles.acceptedResponse]}>
            {/* Voting System */}
            <View style={styles.voteContainer}>
              <TouchableOpacity onPress={() => handleVote(item.id, "upvote")}>
                <Icon name="arrow-upward" type="material" color="#fff" size={20} />
              </TouchableOpacity>
              <Text style={styles.voteCount}>{item.votes || 0}</Text>
              <TouchableOpacity onPress={() => handleVote(item.id, "downvote")}>
                <Icon name="arrow-downward" type="material" color="#fff" size={20} />
              </TouchableOpacity>
            </View>

            {/* Response Content */}
            <View style={styles.responseContent}>
              <Text style={styles.responseText}>{item.message}</Text>
              {post.user_id === user.uid && !item.is_accepted && post.status === "open" && (
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptResponse(item.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              )}
              {item.is_accepted && <Text style={styles.acceptedLabel}>Accepted</Text>}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noResponsesText}>No responses yet.</Text>}
      />

      {/* Add Response Input */}
      {post?.status === "open" && (
        <View style={styles.responseInputContainer}>
          <TextInput
            style={styles.responseInput}
            placeholder="Type your response..."
            placeholderTextColor="#aaa"
            value={responseText}
            onChangeText={setResponseText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleAddResponse} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Icon name="send" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1c1b",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#2a2e2e",
    borderRadius: 10,
  },
  postContainer: {
    backgroundColor: "#2a2e2e",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 8,
  },
  postStatus: {
    fontSize: 14,
    color: "#95ff77",
  },
  responseCard: {
    flexDirection: "row",
    backgroundColor: "#2a2e2e",
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  voteContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  voteCount: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 8,
  },
  responseContent: {
    flex: 1,
  },
  responseText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  acceptButton: {
    backgroundColor: "#95ff77",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: 14,
    color: "#1a1c1b",
    fontWeight: "bold",
  },
  acceptedLabel: {
    fontSize: 14,
    color: "#1a1c1b",
    fontWeight: "bold",
    marginTop: 8,
  },
  responseInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2e2e",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  responseInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  noResponsesText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 16,
  },
});

export default PostDetailsScreen;