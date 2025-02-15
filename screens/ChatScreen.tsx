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
import { useNavigation, useRoute } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Logo from "@/components/ui/Logo";

const OPENAI_API_KEY =
  "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";

const SERPAPI_KEY =
  "2c464ccd6bf9d342cd364f66bf1c68c87f2053a15f7e4e36cb1fa3af0c36af77";

const ChatScreen = () => {
  const navigation = useNavigation();
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

  const fetchYoutubeVideosFromSerpAPI = async (query) => {
    try {
      const searchQuery = [
        query,
        carDetails?.make,
        carDetails?.model,
        carDetails?.modelYear,
      ]
        .filter(Boolean)
        .join(" ");

      const url = `https://serpapi.com/search.json?engine=youtube&search_query=${encodeURIComponent(
        searchQuery
      )}&gl=us&hl=en&api_key=${SERPAPI_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.video_results && data.video_results.length > 0) {
        return data.video_results.slice(0, 1).map((video) => ({
          title: video.title,
          link: video.link + "&pp=ygU%3D",
          thumbnail:
            video.thumbnail?.static ||
            `https://img.youtube.com/vi/${
              video.link.split("v=")[1]
            }/hqdefault.jpg`, // Always use static image
        }))[0];
      }
    } catch (error) {}
    return null;
  };

  const fetchImagesFromSerpAPI = async (query) => {
    try {
      const response = await fetch(
        `https://serpapi.com/search.json?q=${encodeURIComponent(
          query
        )}&location=United+States&hl=en&gl=us&google_domain=google.com&tbm=isch&api_key=${SERPAPI_KEY}`
      );
      const data = await response.json();
      if (data.images_results && data.images_results.length > 0) {
        return data.images_results.slice(0, 3).map((img) => img.original);
      }
    } catch (error) {}
    return [];
  };

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
        // Fetch AI response (TEXT ONLY)
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
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
                  content: `You are CarTechAI, an AI mechanic. The car details provided are: ${JSON.stringify(
                    carDetails
                  )}. Respond with text only. Only Respond to AutoMobile related queries.`,
                },
                { role: "user", content: inputText },
              ],
            }),
          }
        );

        const data = await response.json();
        const aiResponse =
          data.choices?.[0]?.message?.content.trim() +
            "\n\n🔽 **For images and videos, see below.** 🔽" ||
          "Sorry, I could not understand that.\n\n🔽 **For images and videos, see below.** 🔽";

        // Fetch images
        const images = await fetchImagesFromSerpAPI(
          `${inputText} ${carDetails?.make} ${carDetails?.model} ${carDetails?.modelYear} official diagrams`
        );

        // Fetch YouTube video
        const youtubeVideo = await fetchYoutubeVideosFromSerpAPI(
          `${inputText} ${carDetails?.make} ${carDetails?.model} ${carDetails?.modelYear} tutorial`
        );

        if (!youtubeVideo) {
          console.warn("No YouTube video found for this query.");
        }

        const typeWriterEffect = (text, callback, completeCallback) => {
          let index = 0;
          let typedText = "";
        
          const interval = setInterval(() => {
            if (index < text.length) {
              typedText += text.charAt(index);
              index++;
              callback(typedText);
            } else {
              clearInterval(interval);
              if (completeCallback) completeCallback(); // Ensure images and video data are added after typing
            }
          }, 10); // Typing speed
        };
        
        setMessages((prevMessages) => [
          ...prevMessages.filter((message) => message.id !== "typing"),
          {
            id: Date.now().toString(),
            text: "",
            sender: "bot",
            images: [], // Placeholder
            youtubeVideo: null, // Placeholder
          },
        ]);
        
        typeWriterEffect(
          aiResponse,
          (updatedText) => {
            setMessages((prevMessages) =>
              prevMessages.map((msg, idx) =>
                idx === prevMessages.length - 1
                  ? { ...msg, text: updatedText }
                  : msg
              )
            );
          },
          () => {
            // Once typing is done, update message with images & video
            setMessages((prevMessages) =>
              prevMessages.map((msg, idx) =>
                idx === prevMessages.length - 1
                  ? { ...msg, images, youtubeVideo }
                  : msg
              )
            );
          }
        );
        
        
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

  useEffect(() => {
    if (flatListRef.current) {
      // Use a small timeout to ensure the FlatList is fully updated
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100); // Adjust the delay if needed
    }
  }, [messages]); // Dependency array ensures it runs when messages change

  const renderItem = ({ item }) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const imagePattern =
      /(https?:\/\/[^\s)]+?\.(?:png|jpg|jpeg|gif))(?=[\s)]|$)/i;
    const pdfPattern = /(https?:\/\/[^\s)]+?\.pdf)(?=[\s)]|$)/i;
    const boldPattern = /\*\*(.*?)\*\*/g;
    const emojiPattern = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

    const textWithMedia = item.text.split(urlPattern).map((part, index) => {
      if (imagePattern.test(part)) {
        const match = part.match(imagePattern);
        if (match) {
          const cleanImageUrl = match[1];
          return (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(cleanImageUrl)}
            >
              <Image
                source={{ uri: cleanImageUrl }}
                style={styles.chatImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        }
      } else if (pdfPattern.test(part)) {
        return (
          <TouchableOpacity
            key={index}
            style={styles.linkContainer}
            onPress={() => Linking.openURL(part)}
          >
            <Text style={[styles.link, styles.boldText]}>📄 Open PDF</Text>
          </TouchableOpacity>
        );
      } else if (urlPattern.test(part)) {
        return (
          <TouchableOpacity
            key={index}
            style={styles.linkContainer}
            onPress={() => Linking.openURL(part)}
          >
            <Text style={styles.link}>{part}</Text>
          </TouchableOpacity>
        );
      } else if (boldPattern.test(part)) {
        const boldText = part.replace(boldPattern, (match, p1) => p1);
        return (
          <Text key={index} style={[styles.messageText, styles.boldText]}>
            {boldText}
          </Text>
        );
      } else if (emojiPattern.test(part)) {
        return (
          <Text key={index} style={styles.emojiText}>
            {part}
          </Text>
        );
      }

      return (
        <Text key={index} style={styles.messageText}>
          {part}
        </Text>
      );
    });

    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === "user" ? styles.userMessage : styles.botMessage,
        ]}
      >
        {textWithMedia}

        {/* Display YouTube video with clickable link and thumbnail */}
        {item.youtubeVideo && (
          <View style={styles.youtubeContainer}>
            {/* Clickable YouTube Link */}
            <TouchableOpacity
              onPress={() => Linking.openURL(item.youtubeVideo.link)}
            >
              <Text style={styles.link}>▶ {item.youtubeVideo.title}</Text>
            </TouchableOpacity>

            {/* Clickable YouTube Thumbnail */}
            <TouchableOpacity
              onPress={() => Linking.openURL(item.youtubeVideo.link)}
              style={styles.youtubeThumbnailContainer}
            >
              <Image
                source={{ uri: item.youtubeVideo.thumbnail }}
                style={styles.youtubeThumbnail}
              />
              {/* Play Button Overlay */}
              <View style={styles.youtubePlayButton}>
                <Text style={styles.playButtonText}>▶</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Display images from SerpAPI */}
        {item.images?.length > 0 && (
          <View style={styles.imageContainer}>
            {item.images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(img)}
              >
                <Image source={{ uri: img }} style={styles.chatImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Logo />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.editButton}
          >
            <Icon name="edit" type="feather" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.chatBox}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    width: "100%",
  },
  chatImage: {
    width: "100%",
    maxWidth: 300,
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginTop: 5,
    alignSelf: "flex-start",
    resizeMode: "contain",
  },

  logo: {
    flexDirection: "row",
    alignItems: "center",
  },

  animation: {
    width: 50,
    height: 50,
  },
  youtubeContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  youtubeThumbnailContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  youtubeThumbnail: {
    width: "100%", // Makes it responsive
    aspectRatio: 16 / 9, // Ensures proper YouTube thumbnail aspect ratio
    borderRadius: 8,
    marginTop: 5,
    resizeMode: "cover", // Ensures the image covers the entire area
  },
  youtubePlayButton: {
    position: "absolute",
    top: "48%",
    left: "45%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: "#FF0000",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
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
    fontFamily: 'Aeonik',
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
    fontFamily: 'Aeonik',
    alignSelf: "flex-end",
    backgroundColor: "#fff",
  },
  botMessage: {
    fontFamily: 'Aeonik',
    alignSelf: "flex-start",
    backgroundColor: "#95ff77",
  },
  messageText: {
    fontFamily: 'Aeonik',
    fontSize: 16,
    color: "#2a2e2e",
  },
  boldText: {
    fontFamily: 'Aeonik',
    fontSize: 16,
  },
  imageContainer: {
    flexWrap: "wrap",
    marginTop: 20,
  },
  typingText: {
    fontFamily: 'Aeonik',
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
    fontFamily: 'Aeonik',
    fontSize: 16,
    color: "#0066cc", // Blue color for links
    textDecorationLine: "underline", // Underline for links
  },
  inputContainer: {
    flexDirection: "column",
    alignSelf: "flex-start",
    height: 60,
    borderColor: "#444",
    marginBottom: 5,
    marginTop  : 10,
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
    fontFamily: 'Aeonik',
    fontSize: 16,
  },
  sendButton: {
    paddingTop: 16,
    borderRadius: 10,
    position: "absolute",
    right: 20,
  },
});

export default ChatScreen;
