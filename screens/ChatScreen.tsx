import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Image,
} from "react-native";
import { Icon } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const OPENAI_API_KEY = "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";

const ChatScreen = () => {
  const flatListRef = useRef(null); // Reference to FlatList
  const route = useRoute();
  const { carDetails } = route.params || {};

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: `Hello! I am CarTechAI. How can I assist you with your car: ${carDetails?.make} ${carDetails?.model} - ${carDetails?.modelYear}?`,
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Function to send a message and get a response from OpenAI
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setInputText("");
    setIsTyping(true);

    const typingMessage = {
      id: "typing",
      text: "CarTechAI is typing...",
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    setTimeout(async () => {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are CarTechAI, an AI mechanic. The car details provided are: ${JSON.stringify(carDetails)}. Please verify the accuracy of the details and ensure everything is correct. If there are discrepancies, notify the user immediately. Additionally, provide relevant YouTube video links (this is the most important feature) for troubleshooting, maintenance, or related car issues, along with any images, if applicable.`,
              },
              { role: "user", content: inputText },
            ],
            
          }),
        });

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content.trim() || "Sorry, I could not understand that.";
        console.log("AI Response:", aiResponse); // Debugging: Log the AI response
        setMessages((prevMessages) => [
          ...prevMessages.filter((message) => message.id !== "typing"), 
          { id: Date.now().toString(), text: aiResponse, sender: "bot" },
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages.filter((message) => message.id !== "typing"), 
          {
            id: Date.now().toString(),
            text: "Error: Unable to get a response.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 200);
  };

  // Scroll to the bottom after messages are updated
  useEffect(() => {
    if (flatListRef.current) {
      // Use a small timeout to ensure the FlatList is fully updated
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100); // Adjust the delay if needed
    }
  }, [messages]); // Dependency array ensures it runs when messages change

  const handleLinkPress = (url) => {
    console.log("Opening URL:", url); 
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  const getYoutubeThumbnail = (url) => {
    const youtubePattern =
      /(?:https?:\/\/(?:www\.)?(?:youtube|youtu|youtube-nocookie)\.com\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/(\S+)))|(?:youtu\.be\/(\S+))/;
    const match = url.match(youtubePattern);
    if (match) {
      const videoId = match[1] || match[2];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  const renderItem = ({ item }) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const boldPattern = /(\*\*\*[^\*]+\*\*\*)/g; // Matches ***bold***
  
    const textWithLinksAndBold = item.text.split(urlPattern).map((part, index) => {
      if (part.match(urlPattern)) {
        const youtubeThumbnail = getYoutubeThumbnail(part);
        return (
          <TouchableOpacity key={index} style={styles.linkContainer} onPress={() => handleLinkPress(part)}>
            <TouchableOpacity>
              <Text style={styles.link}>
                {part}
              </Text>
            </TouchableOpacity>
            {youtubeThumbnail && (
              <Image source={{ uri: youtubeThumbnail }} style={styles.youtubeThumbnail} />
            )}
          </TouchableOpacity>
        );
      } else if (part.match(boldPattern)) {
        const boldText = part.replace(/\*\*\*/g, ""); // Remove the ***
        return (
          <Text key={index} style={[styles.messageText, styles.boldText]}>
            {boldText}
          </Text>
        );
      }
      return <Text key={index} style={styles.messageText}>{part}</Text>;
    });
  
    return (
      <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
        <Text style={styles.messageText}>{textWithLinksAndBold}</Text>
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        <View style={styles.header}>
          <LottieView
            source={require('../assets/animations/ai.json')}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>CarTechAI</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.chatBox}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    justifyContent: 'center',
  },
  animation: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
  },
  title: {
    fontFamily: 'WorkSans',
    fontSize: 20,
    color: "#fff",
    marginTop: 8,
    marginBottom: 8,
  },
  chatBox: {
    flexGrow: 1,
    width: "100%",
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 16,
    maxWidth: "80%",
  },
  userMessage: {
    fontFamily: 'WorkSans',
    alignSelf: "flex-end",
    backgroundColor: "#fff",
  },
  botMessage: {
    fontFamily: 'WorkSans',
    alignSelf: "flex-start",
    backgroundColor: "#95ff77",
  },
  messageText: {
    fontFamily: 'WorkSans',
    fontSize: 16,
    color: "#2a2e2e",
  },
  boldText:{
    fontFamily: 'WorkSans',
    fontSize: 16,
  },
  typingText: {
    fontFamily: 'WorkSans',
    fontSize: 16,
    color: "#2a2e2e",
    fontStyle: "italic",
  },
  typingContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 16,
    backgroundColor: "#95ff77", // Same color as bot messages
    maxWidth: "80%",
  },
  linkContainer: {
    marginVertical: 5,
  },
  link: {
    zIndex: 100,
    fontFamily: 'WorkSans',
    fontSize: 16,
    color: "#0066cc", // Blue color for links
    textDecorationLine: "underline", // Underline for links
  },
  youtubeThumbnail: {
    width: 200,
    height: 113,
    marginTop: 5,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderColor: "#444",
    width: "100%",
    backgroundColor: "#0f0f0f",
    position: "relative",
  },
  input: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    height: 60,
    borderColor: "#555",
    borderRadius: 32,
    color: "#fff",
    backgroundColor: "#222",
    fontFamily: 'WorkSans',
    fontSize: 16,
    
  },
  sendButton: {
    marginLeft: -50,
    padding: 10,
    borderRadius: 10,
    position: "absolute",
    right: 20,
  },
});

export default ChatScreen;