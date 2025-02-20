import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app, auth } from "../config/firebaseConfig";

export const createChat = async () => {
  try {
    const db = getFirestore(app);
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    const chatRef = await addDoc(collection(db, "chats"), {
      user_id: user.uid,
      participants: [user.uid],
      created_at: serverTimestamp(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days expiration
    });
    
    return chatRef.id; 
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
};

export const addMessage = async (chatId, sender, message, images = [], youtubeVideo = null) => {
  try {
    if (!chatId) throw new Error("Chat ID is required");

    const db = getFirestore();
    const messageData = {
      sender,
      message,
      timestamp: serverTimestamp(),
    };

    // Add images if available
    if (images.length > 0) {
      messageData.images = images;
    }

    // Add YouTube video if available
    if (youtubeVideo) {
      messageData.youtubeVideo = youtubeVideo;
    }

    const messageRef = await addDoc(collection(db, "chats", chatId, "messages"), messageData);

    return messageRef.id;
  } catch (error) {
    console.error("Error adding message:", error);
    return null;
  }
};

export const getChats = async () => {
  try {
    const db = getFirestore(app);
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated");

    const chatsQuery = query(collection(db, "chats"), where("user_id", "==", user.uid));
    const querySnapshot = await getDocs(chatsQuery);

    const chats = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};