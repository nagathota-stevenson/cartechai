import React, { useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";


// Function to process text with media (Optimized)
const processTextWithMedia = (text, item, handleImageLoad) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const imagePattern = /(https?:\/\/[^\s)]+?\.(?:png|jpg|jpeg|gif))(?=[\s)]|$)/i;
  const pdfPattern = /(https?:\/\/[^\s)]+?\.pdf)(?=[\s)]|$)/i;
  const boldPattern = /\*\*(.*?)\*\*/g;
  const emojiPattern = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

  return (text || "").split(urlPattern).map((part, index) => {
    if (imagePattern.test(part)) {
      return (
        <TouchableOpacity key={index} onPress={() => Linking.openURL(part)}>
          <Image source={{ uri: part }} style={styles.chatImage} onLoad={() => handleImageLoad(item.id)} />
        </TouchableOpacity>
      );
    } else if (pdfPattern.test(part)) {
      return (
        <TouchableOpacity key={index} style={styles.linkContainer} onPress={() => Linking.openURL(part)}>
          <Text style={[styles.link, styles.boldText]}>📄 Open PDF</Text>
        </TouchableOpacity>
      );
    } else if (urlPattern.test(part)) {
      return (
        <TouchableOpacity key={index} style={styles.linkContainer} onPress={() => Linking.openURL(part)}>
          <Text style={styles.link}>{part}</Text>
        </TouchableOpacity>
      );
    } else if (boldPattern.test(part)) {
      return <Text key={index} style={[styles.messageText, styles.boldText]}>{part.replace(boldPattern, "$1")}</Text>;
    } else if (emojiPattern.test(part)) {
      return <Text key={index} style={styles.emojiText}>{part}</Text>;
    }
    return <Text key={index} style={styles.messageText}>{part}</Text>;
  });
};

// Memoized RenderItem Function
const RenderChat = memo(({ item, loadingStates, setLoadingStates }) => {
  const handleImageLoad = useCallback((id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: false }));
  }, [setLoadingStates]);

  const imageLoading = loadingStates[item.id] ?? true;
  const thumbnailLoading = loadingStates[item.id + "-thumbnail"] ?? true;

  return (
    <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
      {/* Processed text with media */}
      {processTextWithMedia(item.text || item.message, item, handleImageLoad)}

      {/* YouTube Video Section */}
      {item.youtubeVideo && (
        <View style={styles.youtubeContainer}>
          <TouchableOpacity onPress={() => Linking.openURL(item.youtubeVideo.link)}>
            <Text style={styles.link}>▶ {item.youtubeVideo.title}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(item.youtubeVideo.link)} style={styles.youtubeThumbnailContainer}>
            <View>
              {thumbnailLoading && <ActivityIndicator size="small" color="#FF0000" style={styles.loadingIndicator} />}
              <Image source={{ uri: item.youtubeVideo.thumbnail }} style={styles.youtubeThumbnail} onLoad={() => handleImageLoad(item.id + "-thumbnail")} />
            </View>
            <View style={styles.youtubePlayButton}>
              <Text style={styles.playButtonText}>▶</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Display Additional Images */}
      {item.images?.length > 0 && (
        <View style={styles.imageContainer}>
          {item.images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(img)}>
              <View>
                {imageLoading && <ActivityIndicator size="small" color="#00ff00" style={styles.loadingIndicator} />}
                <Image source={{ uri: img }} style={styles.chatImage} onLoad={() => handleImageLoad(item.id)} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
});


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
    borderRadius: 8,
    marginTop: 5,
    alignSelf: "flex-start",
    resizeMode: "cover",
  },

  logo: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 16,
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
    backgroundColor: "#1a1c1b",
    alignItems: "center",
  },
  title: {
    fontFamily: "Aeonik",
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
  },
  userMessage: {
    fontFamily: "Aeonik",
    alignSelf: "flex-end",
    backgroundColor: "#fff",
  },
  botMessage: {
    fontFamily: "Aeonik",
    alignSelf: "flex-start",
    backgroundColor: "#95ff77",
  },
  messageText: {
    fontFamily: "Aeonik",
    fontSize: 16,
    color: "#1a1c1b",
  },
  boldText: {
    fontFamily: "Aeonik",
    fontSize: 16,
  },
  imageContainer: {
    flexWrap: "wrap",
  },
  typingText: {
    fontFamily: "Aeonik",
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
    fontFamily: "Aeonik",
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
    marginTop: 10,
    width: "100%",
    position: "relative",
  },
  input: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    height: 60,
    borderColor: "#555",
    borderRadius: 16,
    color: "#fff",
    backgroundColor: "#1a1c1b",
    fontFamily: "Aeonik",
    fontSize: 16,
  },
  sendButton: {
    paddingTop: 16,
    borderRadius: 10,
    position: "absolute",
    right: 20,
  },
});


export default RenderChat;
